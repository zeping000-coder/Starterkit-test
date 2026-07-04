"use client";

// ================================================================
// S&P 500 추이를 보여주는 라인 차트
//
// lightweight-charts는 "직접 그림을 그려주는" 라이브러리라서
// React처럼 <div>를 그냥 두고 useEffect 안에서 캔버스를 붙였다 뗐다
// 해줘야 해요. 비유하자면 React가 "무엇을 그릴지 설계도"를 그린다면,
// 이 컴포넌트 안에서는 "실제 붓질은 lightweight-charts에게 맡긴다"는
// 느낌입니다.
//
// ※ v5부터는 `chart.addLineSeries(...)` 대신
//   `chart.addSeries(LineSeries, options)` 형태로 바뀌었어요(공식 문서 확인 완료).
// ================================================================
import { useEffect, useRef } from "react";
import { createChart, LineSeries, type IChartApi } from "lightweight-charts";
import type { ChartPoint } from "@/lib/indicators";

export function IndicatorChart({ data }: { data: ChartPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) 차트 생성 (배경은 투명하게 해서 카드 배경색을 그대로 사용)
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 260,
      layout: {
        background: { color: "transparent" },
        textColor: "#6b7280", // gray-500: 라이트/다크 모드 둘 다 무난하게 보이는 색
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.15)" },
        horzLines: { color: "rgba(148, 163, 184, 0.15)" },
      },
      timeScale: { borderVisible: false },
      rightPriceScale: { borderVisible: false },
    });
    chartRef.current = chart;

    // 2) 라인 시리즈 추가 + 데이터 채우기
    const series = chart.addSeries(LineSeries, {
      color: "#2563eb", // blue-600
      lineWidth: 2,
    });
    series.setData(data);
    chart.timeScale().fitContent();

    // 3) 카드/창 크기가 바뀌면 차트도 같이 리사이즈 (ResizeObserver 사용)
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        chart.resize(entry.contentRect.width, 260);
      }
    });
    resizeObserver.observe(container);

    // 4) 컴포넌트가 사라질 때(unmount) 반드시 차트를 정리해야
    //    메모리 누수(안 쓰는데 계속 남아있는 상태)가 안 생김
    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
}

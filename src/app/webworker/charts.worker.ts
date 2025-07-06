import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

/// <reference lib="webworker" />


// Helper to render chart to canvas and get image data
function createChartImage(chartData: any): Promise<string> {
    return new Promise((resolve) => {
        // Increase canvas size for higher resolution
        const width = 1800; // 3x original width
        const height = 1200; // 3x original height
        const canvas = new OffscreenCanvas(width, height);
        // @ts-ignore
        const ctx = canvas.getContext("2d");
        console.log("Creating chart with data:", chartData);

        // Chart.js expects a DOM canvas, so we need to use Chart.js 3.x+ with OffscreenCanvas
        // @ts-ignore
        const chart = new Chart(ctx, {
            type: chartData.type,
            data: chartData.data,
            options: {
                ...chartData.options,
                responsive: false, // Fixed size
                animation: false,
                devicePixelRatio: 3, // High resolution
                plugins: {
                    ...((chartData.options && chartData.options.plugins) || {}),
                    legend: {
                        ...((chartData.options && chartData.options.plugins && chartData.options.plugins.legend) || {}),
                        labels: {
                            ...((chartData.options && chartData.options.plugins && chartData.options.plugins.legend && chartData.options.plugins.legend.labels) || {}),
                            font: {
                                size: 32 // Increase legend label font size
                            }
                        }
                    },
                    title: {
                        ...((chartData.options && chartData.options.plugins && chartData.options.plugins.title) || {}),
                        font: {
                            size: 40 // Increase chart title font size
                        }
                    },
                    tooltip: {
                        ...((chartData.options && chartData.options.plugins && chartData.options.plugins.tooltip) || {}),
                        titleFont: { size: 28 },
                        bodyFont: { size: 24 },
                        footerFont: { size: 20 }
                    }
                },
                scales: {
                    ...((chartData.options && chartData.options.scales) || {}),
                    x: {
                        ...((chartData.options && chartData.options.scales && chartData.options.scales.x) || {}),
                        ticks: {
                            ...((chartData.options && chartData.options.scales && chartData.options.scales.x && chartData.options.scales.x.ticks) || {}),
                            font: {
                                size: 28 // Increase x-axis label font size
                            }
                        }
                    },
                    y: {
                        ...((chartData.options && chartData.options.scales && chartData.options.scales.y) || {}),
                        ticks: {
                            ...((chartData.options && chartData.options.scales && chartData.options.scales.y && chartData.options.scales.y.ticks) || {}),
                            font: {
                                size: 28 // Increase y-axis label font size
                            }
                        }
                    }
                }
            }
        });

        // Wait for chart to render (blocking, no setTimeout needed in webworker)
        canvas.convertToBlob({ type: 'image/png' }).then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
            resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    });
}

addEventListener('message', async (event: MessageEvent<{ chartData: any; chartOptions: any }>) => {
    const { data } = event;
    console.log("Received data in worker:", data);
    // data: { chartData, chartOptions }
    const doc = new jsPDF();

    // Generate chart image
    const chartImage = await createChartImage(data);

    // Add chart image to PDF
    doc.addImage(chartImage, 'PNG', 15, 40, 180, 120);

    // Optionally add a title
    doc.setFontSize(16);
    doc.text("Chart Report", 15, 20);

    // Return the PDF as Uint8Array
    const pdfBytes = doc.output('arraybuffer');
    postMessage(pdfBytes, [pdfBytes]);
});
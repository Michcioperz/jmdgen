<script lang="ts">
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    let canvas;
    onMount(() => {
        const chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
                datasets: [
                    {
                        label: "liczba kobiet na seminarium",
                        data: [1, 0, 1, 1, 0, 1, 1, 2],
                        backgroundColor: "turquoise",
                        borderColor: "turquoise",
                    },
                    {
                        label: "liczba Michałów na seminarium",
                        data: [2, 2, 2, 1, 1, 2, 4, 5],
                        backgroundColor: "pink",
                        borderColor: "pink",
                    },
                ],
            },
            options: {
                elements: {
                    line: {
                        tension: 0.2,
                    },
                },
                layout: {
                    autoPadding: true,
                },
                plugins: {
                    subtitle: {
                        display: true,
                        text: "Badanie współfinansowane ze środków Pączkarnia Z Tradycją User Group",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Rok",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Osoby",
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });
    });
</script>

<canvas width="400" height="400" bind:this={canvas} />

let statisticsDataSet = [];


function parseStatisticsData() {

    const input =
        document.getElementById("statisticsData").value.trim();


    if (!input) {

        throw new Error(
            "Please enter at least one number."
        );

    }


    const values =
        input
            .split(/[,\s]+/)
            .map(value => value.trim())
            .filter(value => value !== "")
            .map(Number);


    if (
        values.length === 0 ||
        values.some(value => !Number.isFinite(value))
    ) {

        throw new Error(
            "Please enter valid numbers separated by commas."
        );

    }


    return values;

}



function calculateMean(values) {

    return (
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );

}



function calculateMedian(values) {

    const sorted =
        [...values].sort(
            (a, b) => a - b
        );


    const middle =
        Math.floor(sorted.length / 2);


    if (sorted.length % 2 === 0) {

        return (
            sorted[middle - 1] +
            sorted[middle]
        ) / 2;

    }


    return sorted[middle];

}



function calculateMode(values) {

    const frequencies = new Map();


    values.forEach(value => {

        frequencies.set(
            value,
            (frequencies.get(value) || 0) + 1
        );

    });


    const highestFrequency =
        Math.max(...frequencies.values());


    if (highestFrequency === 1) {

        return "No mode";

    }


    return [...frequencies.entries()]
        .filter(
            ([, frequency]) =>
                frequency === highestFrequency
        )
        .map(
            ([value]) => value
        )
        .join(", ");

}



function calculateQuartile(sortedValues, quartile) {

    const position =
        (sortedValues.length + 1) *
        quartile;


    if (
        position <= 1
    ) {

        return sortedValues[0];

    }


    if (
        position >= sortedValues.length
    ) {

        return sortedValues[
            sortedValues.length - 1
        ];

    }


    const lowerIndex =
        Math.floor(position) - 1;

    const fraction =
        position - Math.floor(position);


    return (
        sortedValues[lowerIndex] +
        fraction *
        (
            sortedValues[lowerIndex + 1] -
            sortedValues[lowerIndex]
        )
    );

}



function calculateVariance(values, sample = false) {

    if (
        sample &&
        values.length < 2
    ) {

        throw new Error(
            "At least two values are required for sample variance."
        );

    }


    const mean =
        calculateMean(values);


    const squaredDifferences =
        values.map(
            value =>
                Math.pow(
                    value - mean,
                    2
                )
        );


    const divisor =
        sample
            ? values.length - 1
            : values.length;


    return (
        squaredDifferences.reduce(
            (sum, value) => sum + value,
            0
        ) / divisor
    );

}



function formatStatistic(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {

        return value;

    }


    return Number(
        value.toFixed(6)
    );

}



function calculateStatistics() {

    try {

        const values =
            parseStatisticsData();


        statisticsDataSet =
            values;


        const sorted =
            [...values].sort(
                (a, b) => a - b
            );


        const count =
            values.length;


        const sum =
            values.reduce(
                (total, value) =>
                    total + value,
                0
            );


        const mean =
            calculateMean(values);


        const median =
            calculateMedian(values);


        const mode =
            calculateMode(values);


        const minimum =
            sorted[0];


        const maximum =
            sorted[sorted.length - 1];


        const range =
            maximum - minimum;


        const q1 =
            calculateQuartile(
                sorted,
                0.25
            );


        const q3 =
            calculateQuartile(
                sorted,
                0.75
            );


        const iqr =
            q3 - q1;


        const populationVariance =
            calculateVariance(values);


        const populationStandardDeviation =
            Math.sqrt(
                populationVariance
            );


        let sampleVariance = "—";
        let sampleStandardDeviation = "—";


        if (count >= 2) {

            sampleVariance =
                calculateVariance(
                    values,
                    true
                );


            sampleStandardDeviation =
                Math.sqrt(
                    sampleVariance
                );

        }


        document.getElementById("statCount").textContent =
            count;


        document.getElementById("statSum").textContent =
            formatStatistic(sum);


        document.getElementById("statMean").textContent =
            formatStatistic(mean);


        document.getElementById("statMedian").textContent =
            formatStatistic(median);


        document.getElementById("statMode").textContent =
            mode;


        document.getElementById("statMinimum").textContent =
            formatStatistic(minimum);


        document.getElementById("statMaximum").textContent =
            formatStatistic(maximum);


        document.getElementById("statRange").textContent =
            formatStatistic(range);


        document.getElementById("statQ1").textContent =
            formatStatistic(q1);


        document.getElementById("statQ3").textContent =
            formatStatistic(q3);


        document.getElementById("statIQR").textContent =
            formatStatistic(iqr);


        document.getElementById("statPopulationVariance").textContent =
            formatStatistic(
                populationVariance
            );


        document.getElementById("statPopulationStandardDeviation").textContent =
            formatStatistic(
                populationStandardDeviation
            );


        document.getElementById("statSampleVariance").textContent =
            formatStatistic(
                sampleVariance
            );


        document.getElementById("statSampleStandardDeviation").textContent =
            formatStatistic(
                sampleStandardDeviation
            );


        document.getElementById("statisticsResults").innerHTML =

            "<p><strong>Data set:</strong> " +
            sorted.join(", ") +
            "</p>" +

            "<p><strong>Ordered data:</strong> " +
            sorted.join(", ") +
            "</p>";


        renderStatisticsWorking(
            values,
            sorted,
            mean,
            median,
            q1,
            q3,
            populationVariance,
            populationStandardDeviation
        );

    } catch (error) {

        document.getElementById(
            "statisticsResults"
        ).innerHTML =

            "<p><strong>Error:</strong> " +
            error.message +
            "</p>";


        clearStatisticValues();

        document.getElementById(
            "statisticsWorking"
        ).innerHTML =

            "<p>Correct the data set and try again.</p>";

    }

}



function renderStatisticsWorking(
    values,
    sorted,
    mean,
    median,
    q1,
    q3,
    populationVariance,
    populationStandardDeviation
) {

    const sum =
        values.reduce(
            (total, value) =>
                total + value,
            0
        );


    const squaredDifferences =
        values.map(
            value =>
                Math.pow(
                    value - mean,
                    2
                )
        );


    const squaredDifferenceSum =
        squaredDifferences.reduce(
            (total, value) =>
                total + value,
            0
        );


    document.getElementById(
        "statisticsWorking"
    ).innerHTML =

        "<p><strong>1. Count:</strong> " +
        values.length +
        "</p>" +

        "<p><strong>2. Sum:</strong> " +
        values.join(" + ") +
        " = " +
        formatStatistic(sum) +
        "</p>" +

        "<p><strong>3. Mean:</strong> " +
        formatStatistic(sum) +
        " ÷ " +
        values.length +
        " = " +
        formatStatistic(mean) +
        "</p>" +

        "<p><strong>4. Median:</strong> " +
        sorted.join(", ") +
        " → " +
        formatStatistic(median) +
        "</p>" +

        "<p><strong>5. Quartiles:</strong> " +
        "Q1 = " +
        formatStatistic(q1) +
        ", Q3 = " +
        formatStatistic(q3) +
        ", IQR = " +
        formatStatistic(q3 - q1) +
        "</p>" +

        "<p><strong>6. Population variance:</strong> " +
        formatStatistic(squaredDifferenceSum) +
        " ÷ " +
        values.length +
        " = " +
        formatStatistic(populationVariance) +
        "</p>" +

        "<p><strong>7. Population standard deviation:</strong> √" +
        formatStatistic(populationVariance) +
        " = " +
        formatStatistic(
            populationStandardDeviation
        ) +
        "</p>";

}



function clearStatisticValues() {

    const fields = [

        "statCount",
        "statSum",
        "statMean",
        "statMedian",
        "statMode",
        "statMinimum",
        "statMaximum",
        "statRange",
        "statQ1",
        "statQ3",
        "statIQR",
        "statPopulationVariance",
        "statPopulationStandardDeviation",
        "statSampleVariance",
        "statSampleStandardDeviation"

    ];


    fields.forEach(id => {

        document.getElementById(id).textContent =
            "—";

    });

}



function clearStatistics() {

    document.getElementById(
        "statisticsData"
    ).value = "";


    statisticsDataSet = [];


    clearStatisticValues();


    document.getElementById(
        "statisticsResults"
    ).innerHTML =

        "<p>Enter a data set and select Calculate Statistics.</p>";


    document.getElementById(
        "statisticsWorking"
    ).innerHTML =

        "<p>The calculation steps will appear here.</p>";

}

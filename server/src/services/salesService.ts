import Order from "../models/Order.js";

const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

// =====================================
// GET DATE RANGE FROM USER MESSAGE
// =====================================

export const getDateRangeFromMessage = (
    message: string
): DateRange | null => {
    const text = message.toLowerCase().trim();
    const now = new Date();

    // =====================================
    // TODAY
    // =====================================

    if (text.includes("today")) {
        const startDate = new Date(now);

        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + 1);

        return {
            startDate,
            endDate,
            label: "today",
        };
    }

    // =====================================
    // YESTERDAY
    // =====================================

    if (text.includes("yesterday")) {
        const startDate = new Date(now);

        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + 1);

        return {
            startDate,
            endDate,
            label: "yesterday",
        };
    }

    // =====================================
    // LAST MONTH
    // =====================================

    if (text.includes("last month")) {
        const startDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        return {
            startDate,
            endDate,
            label: "last month",
        };
    }

    // =====================================
    // THIS MONTH
    // =====================================

    if (text.includes("this month")) {
        const startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        return {
            startDate,
            endDate,
            label: "this month",
        };
    }

    // =====================================
    // MONTH + YEAR
    // Example: July 2025
    // =====================================

    const monthYearMatch = text.match(
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})\b/
    );

    if (monthYearMatch) {
        const monthName = monthYearMatch[1];
        const yearValue = monthYearMatch[2];

        if (!monthName || !yearValue) {
            return null;
        }

        const year = Number(yearValue);
        const month = months[monthName];

        if (month === undefined) {
            return null;
        }

        const startDate = new Date(
            year,
            month,
            1
        );

        const endDate = new Date(
            year,
            month + 1,
            1
        );

        return {
            startDate,
            endDate,
            label: `${monthName} ${year}`,
        };
    }

    // =====================================
    // YEAR
    // Example: 2025
    // =====================================

    const yearMatch = text.match(
        /\b(20\d{2})\b/
    );

    if (yearMatch) {
        const yearValue = yearMatch[1];

        if (!yearValue) {
            return null;
        }

        const year = Number(yearValue);

        const startDate = new Date(
            year,
            0,
            1
        );

        const endDate = new Date(
            year + 1,
            0,
            1
        );

        return {
            startDate,
            endDate,
            label: `${year}`,
        };
    }

    // =====================================
    // MONTH ONLY
    // Example: July
    // Uses current year
    // =====================================

    for (const monthName of Object.keys(months)) {
        if (text.includes(monthName)) {
            const month = months[monthName];

            if (month === undefined) {
                continue;
            }

            const startDate = new Date(
                now.getFullYear(),
                month,
                1
            );

            const endDate = new Date(
                now.getFullYear(),
                month + 1,
                1
            );

            return {
                startDate,
                endDate,
                label: `${monthName} ${now.getFullYear()}`,
            };
        }
    }

    return null;
};

// =====================================
// GET SALES FOR DATE RANGE
// =====================================

export const getSalesByDateRange = async (
    startDate: Date,
    endDate: Date
) => {
    const salesData = await Order.aggregate([
        {
            $match: {
                status: {
                    $ne: "cancelled",
                },

                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },

        {
            $group: {
                _id: null,

                totalOrders: {
                    $sum: 1,
                },

                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);

    return {
        totalOrders:
            salesData[0]?.totalOrders ?? 0,

        totalRevenue:
            salesData[0]?.totalRevenue ?? 0,
    };
};
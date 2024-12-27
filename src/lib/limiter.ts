

// In-memory implementation for rate limiting
// This implementation only works for single VPS instances
// Hosting to other platforms like vercel may not work
const limitTracker: {
    // User id as key
    [key: string]: {
        limit: number;
        expiresAt: number;
    }
} = {};

export const requestLimiterByUserId = async (userId: string, limit: number = 1, expiryOffset: number): Promise<{ allowed: boolean, message: string, waitTime?: number }> => {
    const currentTime = Date.now();  // Current timestamp in milliseconds

    // If the user is not in the tracker or their limit has expired, reset the limit
    if (!limitTracker[userId] || currentTime >= limitTracker[userId].expiresAt) {
        // Reset the limit to 0 and set a new expiration time
        limitTracker[userId] = {
            limit: 0,  // No requests made yet in this window
            expiresAt: currentTime + expiryOffset, // Set the expiration time
        };
    }

    // Get the user’s tracker
    const userTracker = limitTracker[userId];

    // If the limit has been reached, deny the request
    if (userTracker.limit >= limit) {
        const timeRemaining = userTracker.expiresAt - currentTime;
        const waitTime = timeRemaining > 0 ? timeRemaining : 0;  // Return 0 if expired

        return {
            allowed: false,
            message: `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`,
            waitTime: waitTime,  // Time in milliseconds until the limit resets
        };
    }

    // The user is within the limit, so allow the request and increment the count
    userTracker.limit += 1;

    return {
        allowed: true,
        message: `Request allowed. You have ${limit - userTracker.limit} requests remaining.`,
    };
}
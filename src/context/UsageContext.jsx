// context/UsageContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const UsageContext = createContext();

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error("useUsage must be used within a UsageProvider");
  }
  return context;
};

const TIERS = {
  FREEMIUM: { name: "Freemium", limit: 2, price: 0 },
  BASIC: { name: "Basic", limit: 5, price: 5 },
  PREMIUM: { name: "Premium", limit: 10, price: 10 },
  PREMIUM_PLUS: { name: "Premium+", limit: -1, price: 15 }, // -1 = unlimited
};

export const UsageProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userTier, setUserTier] = useState("FREEMIUM");
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Get Firebase auth token for API requests
  const getAuthHeaders = async () => {
    if (!currentUser) return {};

    try {
      const token = await currentUser.getIdToken(true); // Force fresh token
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
      return { "Content-Type": "application/json" };
    }
  };

  // Fetch user data from database with authentication
  const fetchUserData = useCallback(async () => {
    if (!currentUser || authLoading) return;

    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();

      console.log(`Fetching user data for ${currentUser.uid}`);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${currentUser.uid}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed - user may need to re-login");
          // Force user to re-authenticate
          await currentUser.getIdToken(true); // Force token refresh
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch user data`);
      }

      const result = await response.json();
      const userData = result.data;

      console.log("Raw user data from API:", userData);

      // Update state with database data
      setUserTier(userData.tier || "FREEMIUM");
      setUsageCount(userData.usageCount || 0);
      setSubscriptionData({
        customerId: userData.stripeCustomerId,
        subscriptionId: userData.stripeSubscriptionId,
        status: userData.subscriptionStatus,
      });
      setDataFetched(true);

      console.log("✅ User data loaded from database:", {
        userId: currentUser.uid,
        tier: userData.tier,
        usageCount: userData.usageCount,
        subscriptionStatus: userData.subscriptionStatus,
        stripeCustomerId: userData.stripeCustomerId,
        stripeSubscriptionId: userData.stripeSubscriptionId,
      });
    } catch (error) {
      console.error("❌ Error fetching user data:", error);

      // Only use defaults if we haven't fetched data yet
      if (!dataFetched) {
        setUserTier("FREEMIUM");
        setUsageCount(0);
        setSubscriptionData(null);
      }

      // Show user-friendly error
      console.warn(
        "Failed to load user data. Please check your connection and try refreshing."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, authLoading, dataFetched]);

  // Reset state when user changes (including logout)
  useEffect(() => {
    if (!currentUser) {
      // Reset to default values when user logs out
      console.log("🔄 User logged out, resetting state");
      setUserTier("FREEMIUM");
      setUsageCount(0);
      setSubscriptionData(null);
      setDataFetched(false);
    }
  }, [currentUser]);

  // Load user data when auth changes and user is available
  useEffect(() => {
    if (currentUser && !authLoading) {
      console.log("🔄 Current user changed, fetching data...");
      fetchUserData();
    }
  }, [currentUser, authLoading, fetchUserData]);

  const canGenerate = () => {
    const tier = TIERS[userTier];
    return tier.limit === -1 || usageCount < tier.limit;
  };

  // Increment usage with proper error handling
  const incrementUsage = async () => {
    if (!currentUser) {
      console.error("User not authenticated");
      return false;
    }

    if (canGenerate()) {
      try {
        setIsLoading(true);
        const headers = await getAuthHeaders();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${
            currentUser.uid
          }/increment-usage`,
          {
            method: "POST",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();

          if (response.status === 403) {
            // Usage limit exceeded
            setShowUpgradeModal(true);
            return false;
          }

          if (response.status === 401) {
            console.error("Authentication failed during usage increment");
            // Force token refresh and retry
            await currentUser.getIdToken(true);
            return false;
          }

          throw new Error(
            errorData.message ||
              `HTTP ${response.status}: Failed to increment usage`
          );
        }

        const result = await response.json();
        setUsageCount(result.usageCount);

        console.log("✅ Usage incremented:", result.usageCount);
        return true;
      } catch (error) {
        console.error("❌ Error incrementing usage:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowUpgradeModal(true);
      return false;
    }
  };

  // Update tier (called from success page or webhook handler)
  const upgradeTier = async (newTier) => {
    console.log(`🔄 Upgrading tier to: ${newTier}`);
    setUserTier(newTier);
    setUsageCount(0); // Reset usage on tier upgrade
    setShowUpgradeModal(false);

    // Refresh data from database to ensure sync
    if (currentUser) {
      setTimeout(() => {
        fetchUserData();
      }, 1000); // Give the backend a moment to process
    }
  };

  const goToPricing = () => {
    navigate("/pricing");
  };

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    navigate("/pricing");
  };

  const getRemainingGenerations = () => {
    const tier = TIERS[userTier];
    if (tier.limit === -1) return "Unlimited";
    return Math.max(0, tier.limit - usageCount);
  };

  const getCurrentTierInfo = () => TIERS[userTier];

  const resetUsage = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${
          currentUser.uid
        }/reset-usage`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed during usage reset");
          await currentUser.getIdToken(true); // Force token refresh
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to reset usage`);
      }

      setUsageCount(0);
      console.log("✅ Usage reset");
    } catch (error) {
      console.error("❌ Error resetting usage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    if (
      !subscriptionData ||
      (!subscriptionData.customerId && !subscriptionData.subscriptionId)
    ) {
      throw new Error("No subscription information found");
    }

    setIsLoading(true);

    try {
      console.log("🔄 Cancelling subscription:", subscriptionData);
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cancel-subscription`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            customerId: subscriptionData.customerId,
            subscriptionId: subscriptionData.subscriptionId,
            userId: currentUser.uid,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }

        if (response.status === 403) {
          throw new Error(
            "Permission denied. Cannot cancel this subscription."
          );
        }

        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to cancel subscription`
        );
      }

      const result = await response.json();
      console.log("✅ Subscription cancelled:", result);

      // Update local state immediately
      setUserTier("FREEMIUM");
      setSubscriptionData(null);

      return result;
    } catch (error) {
      console.error("❌ Error cancelling subscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (!currentUser || !subscriptionData) return false;

    return (
      (subscriptionData.customerId || subscriptionData.subscriptionId) &&
      subscriptionData.status === "active" &&
      userTier !== "FREEMIUM"
    );
  };

  // Get subscription data
  const getSubscriptionData = () => {
    if (!currentUser || !subscriptionData) return null;

    return {
      customerId: subscriptionData.customerId,
      subscriptionId: subscriptionData.subscriptionId,
      hasSubscription: hasActiveSubscription(),
      status: subscriptionData.status,
    };
  };

  // Function to manually refresh user data from database
  const refreshUserData = async () => {
    if (currentUser) {
      console.log("🔄 Manually refreshing user data...");
      setDataFetched(false); // Allow refetch
      await fetchUserData();
    }
  };

  // Retry failed requests with exponential backoff
  const retryWithBackoff = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  return (
    <UsageContext.Provider
      value={{
        userTier,
        usageCount,
        canGenerate,
        incrementUsage,
        upgradeTier,
        getRemainingGenerations,
        getCurrentTierInfo,
        showUpgradeModal,
        setShowUpgradeModal,
        resetUsage,
        TIERS,
        goToPricing,
        handleUpgradeFromModal,
        cancelSubscription,
        hasActiveSubscription,
        getSubscriptionData,
        isLoading,
        refreshUserData,
        subscriptionData,
        retryWithBackoff,
        dataFetched, // Expose this so components can check if data is loaded
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};

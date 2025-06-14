// context/UsageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom"; // Add this import

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
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Add this
  const [userTier, setUserTier] = useState("FREEMIUM");
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load user data on auth change
  useEffect(() => {
    if (currentUser) {
      const savedTier =
        localStorage.getItem(`tier_${currentUser.uid}`) || "FREEMIUM";
      const savedUsage =
        parseInt(localStorage.getItem(`usage_${currentUser.uid}`)) || 0;
      setUserTier(savedTier);
      setUsageCount(savedUsage);
    } else {
      setUserTier("FREEMIUM");
      setUsageCount(0);
    }
  }, [currentUser]);

  const saveToStorage = (tier, usage) => {
    if (currentUser) {
      localStorage.setItem(`tier_${currentUser.uid}`, tier);
      localStorage.setItem(`usage_${currentUser.uid}`, usage.toString());
    }
  };

  const canGenerate = () => {
    const tier = TIERS[userTier];
    return tier.limit === -1 || usageCount < tier.limit;
  };

  const incrementUsage = () => {
    if (!currentUser) return false;

    if (canGenerate()) {
      const newUsage = usageCount + 1;
      setUsageCount(newUsage);
      saveToStorage(userTier, newUsage);
      return true;
    } else {
      setShowUpgradeModal(true);
      return false;
    }
  };

  const upgradeTier = (newTier) => {
    setUserTier(newTier);
    saveToStorage(newTier, usageCount);
    setShowUpgradeModal(false);
  };

  // Add this new function for direct navigation to pricing
  const goToPricing = () => {
    navigate("/pricing");
  };

  // Add this function for handling upgrade modal actions
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

  const resetUsage = () => {
    setUsageCount(0);
    if (currentUser) {
      localStorage.setItem(`usage_${currentUser.uid}`, "0");
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
        goToPricing, // Add this
        handleUpgradeFromModal, // Add this
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};


import React from "react";

// Utility functions for theme styling
export const getButtonStyle = (style?: string): string => {
  const buttonStyle = style || "rounded";
  switch (buttonStyle) {
    case "squared": return "rounded-none";
    case "pill": return "rounded-full";
    default: return "rounded-md";
  }
};

export const getImageStyle = (style?: string): string => {
  const imageStyle = style || "rounded";
  switch (imageStyle) {
    case "squared": return "rounded-none";
    case "circle": return "rounded-full";
    default: return "rounded-md";
  }
};

export const getHeaderStyle = (style?: string): string => {
  const headerStyle = style || "standard";
  switch (headerStyle) {
    case "minimal": return "py-2";
    case "centered": return "py-6 text-center";
    default: return "py-4";
  }
};

export const getProductsGridStyle = (
  productsPerRow: number = 3,
  device: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string => {
  const productsPerRowDesktop = device === 'desktop' 
    ? productsPerRow 
    : (device === 'tablet' ? Math.min(productsPerRow, 2) : 1);
  return `grid-cols-${productsPerRowDesktop}`;
};

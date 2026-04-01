export const Analytics = {
  landingViewed: () => {},
  ctaClicked: (data?: any) => {},
  pricingTabSwitched: (data?: any) => {}
};

export const captureEvent = (eventName: string, properties?: any) => {
  console.log('Event Captured:', eventName, properties);
};

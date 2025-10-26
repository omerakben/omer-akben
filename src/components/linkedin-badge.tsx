"use client";

import { useEffect } from "react";

const LINKEDIN_SCRIPT_ID = "linkedin-badge-script";
const LINKEDIN_SCRIPT_SRC = "https://platform.linkedin.com/badges/js/profile.js";

type LinkedInWindow = typeof window & {
  LI?: {
    Widgets?: {
      load?: () => void;
      refresh?: () => void;
    };
  };
};

function invokeLinkedInWidgets() {
  if (typeof window === "undefined") {
    return;
  }

  const widgets = (window as LinkedInWindow).LI?.Widgets;
  widgets?.load?.();
  widgets?.refresh?.();
}

function ensureLinkedInScript() {
  if (typeof document === "undefined") {
    return;
  }

  const existingScript = document.getElementById(LINKEDIN_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript) {
    if (existingScript.getAttribute("data-loaded") === "true") {
      invokeLinkedInWidgets();
    }
    return;
  }

  const script = document.createElement("script");
  script.id = LINKEDIN_SCRIPT_ID;
  script.src = LINKEDIN_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    script.setAttribute("data-loaded", "true");
    invokeLinkedInWidgets();
  };

  document.body.appendChild(script);
}

export function LinkedInBadge() {
  useEffect(() => {
    ensureLinkedInScript();
  }, []);

  return (
    <div className="linkedin-badge-container space-y-4" aria-label="LinkedIn profile badges">
      <div className="linkedin-badge-wrapper linkedin-badge-light">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="light"
          data-type="VERTICAL"
          data-vanity="omerakben"
          data-version="v1"
        >
          <a className="badge-base__link LI-simple-link" href="https://www.linkedin.com/in/omerakben?trk=profile-badge">
            Omer AKBEN
          </a>
        </div>
      </div>
      <div className="linkedin-badge-wrapper linkedin-badge-dark">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="dark"
          data-type="VERTICAL"
          data-vanity="omerakben"
          data-version="v1"
        >
          <a className="badge-base__link LI-simple-link" href="https://www.linkedin.com/in/omerakben?trk=profile-badge">
            Omer AKBEN
          </a>
        </div>
      </div>
    </div>
  );
}


'use client'

import React from 'react'

interface DynamicCardStylesProps {
  settings?: {
    card_image_height_desktop?: string;
    card_image_height_mobile?: string;
    sync_mobile_card_size?: boolean;
    pub_card_media_height_desktop?: string;
    pub_card_media_height_mobile?: string;
    scholar_card_media_height_desktop?: string;
    scholar_card_media_height_mobile?: string;
    sync_mobile_scholar_card_size?: boolean;
  };
}

export default function DynamicCardStyles({ settings }: DynamicCardStylesProps) {
  if (!settings) return null;

  const catDesktopRaw = settings.card_image_height_desktop || '280px';
  const syncMobile = settings.sync_mobile_card_size !== false;
  const catMobileRaw = syncMobile ? catDesktopRaw : (settings.card_image_height_mobile || '280px');

  const pubDesktopRaw = settings.pub_card_media_height_desktop || '180px';
  const pubMobileRaw = syncMobile ? pubDesktopRaw : (settings.pub_card_media_height_mobile || '180px');

  const scholarDesktopRaw = settings.scholar_card_media_height_desktop || '260px';
  const syncScholarMobile = settings.sync_mobile_scholar_card_size === true;
  const scholarMobileRaw = syncScholarMobile ? scholarDesktopRaw : (settings.scholar_card_media_height_mobile || '220px');

  const formatDim = (val: string) => {
    if (!val) return '280px';
    const trimmed = String(val).trim();
    if (trimmed.endsWith('px') || trimmed.endsWith('%') || trimmed.endsWith('rem') || trimmed.endsWith('vh') || trimmed.endsWith('vw')) {
      return trimmed;
    }
    return `${trimmed}px`;
  };

  const catDesktop = formatDim(catDesktopRaw);
  const catMobile = formatDim(catMobileRaw);
  const pubDesktop = formatDim(pubDesktopRaw);
  const pubMobile = formatDim(pubMobileRaw);
  const scholarDesktop = formatDim(scholarDesktopRaw);
  const scholarMobile = formatDim(scholarMobileRaw);

  const css = `
    :root {
      --gsp-cat-card-height-desktop: ${catDesktop};
      --gsp-cat-card-height-mobile: ${catMobile};
      --gsp-pub-card-media-height-desktop: ${pubDesktop};
      --gsp-pub-card-media-height-mobile: ${pubMobile};
      --gsp-scholar-card-media-height-desktop: ${scholarDesktop};
      --gsp-scholar-card-media-height-mobile: ${scholarMobile};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

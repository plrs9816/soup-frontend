import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Header, Media, MobileSideBar, SideBar } from "components";
import { SectionHeader } from "common/components";
import { breakpoints } from "lib/utils";

const BodyContainer = styled.div`
  display: grid;
  grid-template-areas: "header header";
  grid-template-columns: auto 1fr;
`;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Media at="sm">
        <MobileSideBar />
      </Media>
      <BodyContainer>
        <Header />
        <Media greaterThan="sm">
          <SideBar />
        </Media>
        {children}
      </BodyContainer>
    </>
  );
};

type IPageLayout = (
  | {
      title: string;
      description?: string;
    }
  | {
      title?: never;
      description?: never;
    }
) & {
  width?: number;
};

const PageContainer = styled.div<{
  width?: number;
}>`
  display: grid;
  width: 100%;
  align-self: start;
  ${({ width = 1188 }) => css`
    //prettier-ignore
    grid-template-columns: minmax(24px, 1fr) min(calc(100% - 48px), calc(var(--container-width) - 48px)) minmax(${1188 -
    width}px, 0px) minmax(24px, 1fr);
    ${breakpoints.at("sm")} {
      //prettier-ignore
      grid-template-columns: minmax(16px, 1fr) min(calc(100% - 32px), calc(var(--container-width) - 32px)) minmax(${1188 -
      width}px, 0px) minmax(16px, 1fr);
    }
    --container-width: ${width}px;
  `}
  * {
    grid-column: 2;
  }
`;

const PageLayout = ({
  title,
  description,
  children,
  width,
}: React.PropsWithChildren<IPageLayout>) => {
  return (
    <LayoutWrapper>
      <PageContainer width={width}>
        {title && (
          <SectionHeader>
            <SectionHeader.Title>{title}</SectionHeader.Title>
            {description && (
              <SectionHeader.Description>
                {description}
              </SectionHeader.Description>
            )}
          </SectionHeader>
        )}
        {children}
      </PageContainer>
    </LayoutWrapper>
  );
};

export const DefaultPageLayout = ({
  children,
}: React.PropsWithChildren<IPageLayout>) => {
  return (
    <LayoutWrapper>
      <PageContainer>{children}</PageContainer>
    </LayoutWrapper>
  );
};

export const createPageLayout =
  // eslint-disable-next-line react/display-name
  (options: IPageLayout) => (page: React.ReactElement) =>
    React.createElement(PageLayout, options, page);

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Header, Media, MobileSideBar, SideBar } from "components";
import { SectionHeader } from "common/components";

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
  ${({ width = 1198 }) => css`
    grid-template-columns:
      1fr min(100%, ${width}px) minmax(0px, ${1198 - width}px)
      1fr;
    --container-width: ${width}px;
  `}
  & > * {
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

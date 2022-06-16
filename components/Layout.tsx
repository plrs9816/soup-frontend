import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMatch } from "hooks/useMatch";
import { useToggle } from "hooks/useToggle";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useEffect } from "react";
import { Dimmer, Header, Media, Portal } from "components";
import { Button, Flex } from "common/components";
import { NextComponentType } from "next";
import { http } from "common/services";
import { useQuery, QueryClient, dehydrate } from "react-query";
import useAuth from "hooks/useAuth";
import { useSetRecoilState } from "recoil";
import { loginPopupState } from "state";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useTheme as useNextTheme } from "next-themes";
import { json } from "stream/consumers";
import { breakpoints } from "utils";

const PageContainer = styled.div`
  min-height: 100vh;
`;

const BodyContainer = styled.div`
  min-height: 100vh;
  ${breakpoints.greaterThan("md")} {
    margin-left: 240px;
  }
  display: flex;
  flex-direction: row;
  padding-right: 36px;
  padding-left: 36px;
  ${breakpoints.at("sm")} {
    padding-right: 12px;
    padding-left: 12px;
  }
`;

const SideBarContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  background-color: var(--positive);
  position: fixed;
  top: 59px;
  min-width: 240px;
  height: calc(100vh - 59px);
  justify-content: space-between;
  border-right: solid 1px var(--outline);
  padding: 16px;
  ${breakpoints.at("sm")} {
    top: 0;
    height: 100vh;
  }
`;

const SideBarContentWrapper = styled.ul`
  margin: 0;
  line-height: normal;
  list-style-type: none;
  ${breakpoints.at("sm")} {
    top: 0;
  }
`;

const SideBarContainer: NextComponentType = ({ children }) => {
  return (
    <SideBarContainerWrapper>
      <SideBarContentWrapper>{children}</SideBarContentWrapper>
      <footer>
        <div css={{ fontSize: "14px", color: "var(--negative2)" }}>
          개인정보처리방침 <br /> © 2022 SouP
        </div>
      </footer>
    </SideBarContainerWrapper>
  );
};

interface ISideBarProps {
  exact?: boolean;
  selected?: boolean;
  authorized?: boolean;
}
const SideBarLink = styled.a<ISideBarProps>`
  display: block;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-weight: 500;
  ${(props) =>
    props.selected
      ? css`
          font-weight: 700;
          background-color: var(--primarylight);
        `
      : css`
          color: var(--negative2);
          :hover {
            background-color: var(--primarylight2);
          }
        `};
`;

const SideBarElement = ({
  children,
  selected,
  exact,
  authorized,
  ...props
}: ISideBarProps & React.PropsWithChildren<LinkProps>) => {
  const match = useMatch(props.href, exact);
  const setLoginPopup = useSetRecoilState(loginPopupState);
  const auth = useAuth();

  const LinkWrapper =
    authorized && !auth.success
      ? ({ children }: { children: React.ReactNode }) => (
          <SideBarLink onClick={() => setLoginPopup(true)} selected={match}>
            {children}
          </SideBarLink>
        )
      : ({ children }: { children: React.ReactNode }) => (
          <Link {...props}>
            <SideBarLink href={props.href.toString()} selected={match}>
              {children}
            </SideBarLink>
          </Link>
        );

  return (
    <li>
      <LinkWrapper>{children}</LinkWrapper>
    </li>
  );
};

export const ChildrenContainer = styled.div<{
  width?: number;
}>`
  margin-top: 59px;
  margin-bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  --width: ${({ width }) => width || 1140}px;
  & > .dividing {
    margin-right: -36px;
    margin-left: -36px;
    padding-right: 36px;
    padding-left: 36px;
    width: calc(100% + 72px);
    ${breakpoints.at("sm")} {
      margin-right: -12px;
      margin-left: -12px;
      padding-right: 12px;
      padding-left: 12px;
      width: calc(100% + 24px);
    }
  }
`;

const HeaderIconStyle = css({
  color: "var(--negative2)",
  margin: "-9px",
});

const customAnimation = (ms: number) => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `* { transition-duration: 250ms; transition-property: background-color, outline-color, border-color; -webkit-transition-duration: 250ms; -webkit-transition-property: background-color, outline-color, border-color; }`
    )
  );
  document.head.appendChild(css);
  return () => {
    (() => window.getComputedStyle(document.body))();
    setTimeout(() => {
      document.head.removeChild(css);
    }, ms);
  };
};

const SideBarNavigation = () => {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  const setCustomNextTheme = () => {
    const removeAnimation = customAnimation(250);
    setNextTheme(nextTheme === "light" ? "dark" : "light");
    removeAnimation();
  };

  return (
    <>
      <Media at="sm">
        <Button
          icon
          onClick={setCustomNextTheme}
          css={{ width: "36px", marginBottom: "16px" }}
        >
          {nextTheme === "light" ? (
            <MdOutlineLightMode css={HeaderIconStyle} />
          ) : (
            <MdOutlineDarkMode css={HeaderIconStyle} />
          )}
        </Button>
      </Media>
      <SideBarElement href="/" selected>
        홈
      </SideBarElement>
      <SideBarElement authorized href="/projects/write">
        모집 만들기
      </SideBarElement>
      <SideBarElement href="/projects" exact={false}>
        프로젝트/스터디 찾기
      </SideBarElement>
      <SideBarElement href="/lounge">라운지</SideBarElement>
      <br />
      <SideBarElement authorized href="/profile">
        내 프로필
      </SideBarElement>
      <SideBarElement href="">새소식</SideBarElement>
      <SideBarElement href="">쪽지</SideBarElement>
    </>
  );
};

const SideBar = ({
  ...props
}: React.ComponentProps<typeof SideBarContainer>) => {
  return (
    <>
      <SideBarContainer {...props}>
        <SideBarNavigation />
      </SideBarContainer>
    </>
  );
};

const MobileSideBar = ({
  show,
  toggle,
  ...props
}: { show: boolean; toggle: (set?: boolean) => void } & React.ComponentProps<
  typeof SideBarContainer
>) => {
  const router = useRouter();

  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) initial.current = false;
    else if (router.pathname) toggle(false);
  }, [router.pathname, toggle]);

  if (!show) return null;
  return (
    <Portal at="#portal">
      <SideBarContainer {...props}>
        <SideBarNavigation />
      </SideBarContainer>
      <Dimmer onClick={() => toggle()} css={{ zIndex: 9998 }} />
    </Portal>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, toggleShowSideBar] = useToggle();

  const auth = useAuth();

  return (
    <>
      <PageContainer>
        <Header toggleSideBar={toggleShowSideBar} />
        <Media at="sm">
          <MobileSideBar show={showSidebar} toggle={toggleShowSideBar} />
        </Media>
        <Media greaterThan="sm">
          <SideBar />
        </Media>
        <BodyContainer>{children}</BodyContainer>
      </PageContainer>
    </>
  );
};

import {
  MdOutlineSearch,
  MdOutlineNotifications,
  MdOutlineMail,
  MdOutlineMenu,
} from "react-icons/md";
import styled from "@emotion/styled";
import Link, { LinkProps } from "next/link";
import { useToggle } from "hooks/useToggle";
import { css } from "@emotion/react";
import { useOuterClick } from "hooks/useOuterClick";
import React, { useRef } from "react";
import { Box, Flex } from "styles/components/Box";
import { Button } from "styles/components/Button";
import { Login } from "components";
import { Media } from "./Media";

const HeaderContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  box-sizing: border-box;
  padding: 0px 24px;
  ${({ theme }) => theme.breakpoints.at("sm")} {
    padding: 0px 12px;
  }
  position: fixed;
  height: 69px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #eceff1;
  z-index: 999;
`;

const HeaderMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  color: #3e5060;
  & > :not(:last-child) {
    margin-right: 12px;
  }
  svg {
    font-size: 18px;
  }
`;

const LogoLink = styled.a`
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;
  color: #ff8a05;
`;
const Logo = ({ children, ...props }: React.PropsWithChildren<LinkProps>) => (
  <Link {...props}>
    <LogoLink>{children}</LogoLink>
  </Link>
);

const HeaderIconStyle = css({
  color: "#3e5060",
  margin: "-9px",
});

const SearchButton = styled(Button)({
  justifyContent: "space-between",
  width: "200px",
});

const Popup = React.forwardRef<HTMLDivElement>((_, ref) => (
  <Box
    column
    ref={ref}
    css={{
      position: "absolute",
      top: "44px",
      width: "300px",
      right: 0,
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      hr: {
        margin: "8px 0px",
      },
    }}
  >
    알림
    <hr css={{ color: "#dfe2e6" }} />
    어쩌구
    <hr css={{ color: "#dfe2e6" }} />
    어쩌구
    <hr css={{ color: "#dfe2e6" }} />
    어쩌구
  </Box>
));
Popup.displayName = "Popup";

export const Header = ({ toggleSideBar }: { toggleSideBar?: () => void }) => {
  const [login, toggleLogin] = useToggle();
  const [notificationPopup, toggleNotificationPopup] = useToggle();
  const [messagePopup, toggleMessagePopup] = useToggle();

  const notificationRef = useOuterClick<HTMLDivElement>(() =>
    toggleNotificationPopup()
  );
  const messageRef = useOuterClick<HTMLDivElement>(() => toggleMessagePopup());

  return (
    <>
      <header>
        <HeaderContainer
          css={false && { position: "initial", padding: "0px 12px" }}
        >
          <Flex css={{ alignItems: "center", gap: "12px", color: "#fa8705" }}>
            <Media css={{ display: "flex", gap: "12px" }} at="sm">
              <Button
                onClick={toggleSideBar}
                variant="transparent"
                icon
                css={{
                  marginLeft: "4px",
                  fontSize: "24px",
                  padding: 0,
                }}
              >
                <MdOutlineMenu />
              </Button>
              <div
                css={{
                  width: "1px",
                  height: "36px",
                  backgroundColor: "#eceff1",
                }}
              />
            </Media>
            <Logo href="/">SouP</Logo>
          </Flex>
          <HeaderMenuContainer>
            <Media css={{ display: "flex", gap: "12px" }} greaterThan="sm">
              <SearchButton>
                <MdOutlineSearch />
                프로젝트 찾아보기
              </SearchButton>
              <div css={{ position: "relative" }}>
                <Button
                  icon
                  onClick={
                    notificationPopup
                      ? undefined
                      : () => toggleNotificationPopup()
                  }
                  css={{ width: "36px" }}
                >
                  <MdOutlineNotifications css={HeaderIconStyle} />
                </Button>
                {notificationPopup && <Popup ref={notificationRef} />}
              </div>
              <div css={{ position: "relative" }}>
                <Button
                  icon
                  onClick={
                    messagePopup ? undefined : () => toggleMessagePopup()
                  }
                  css={{ width: "36px" }}
                >
                  <MdOutlineMail css={HeaderIconStyle} />
                </Button>
                {messagePopup && <Popup ref={messageRef} />}
              </div>
            </Media>

            <Button
              onClick={() => toggleLogin()}
              variant="primary"
              css={{ fontWeight: "bold" }}
            >
              로그인
            </Button>
          </HeaderMenuContainer>
        </HeaderContainer>
      </header>
      {login && <Login toggle={toggleLogin} />}
    </>
  );
};

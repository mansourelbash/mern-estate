import styled from "@emotion/styled";
import React from "react";
import { Image } from "../Image.tsx";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rtl: boolean;
}

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = () => {
  return (
    <StyledSidebarHeader>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b114ff3d94a64128f530c5472e2cb1e9ec7f3ac32b43af7510404a320c4b5b05?apiKey=b22f6bf7f4034411b849e40a81909ff7&"
          alt="Profile picture"
          className="mr-auto  w-full aspect-square max-w-[41px] absolute"
        />
      </div>
    </StyledSidebarHeader>
  );
};

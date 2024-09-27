import styled from "@emotion/styled";
import { ArrowSquareLeft, ArrowSquareRight } from "iconsax-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store.ts";
import { sidebar } from "./SidebarCollapseSlice.ts";

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

const StyledSidebarFooter = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  color: white;
`;

const StyledCollapsedSidebarFooter = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: white;
`;

export const SidebarFooter: React.FC<SidebarFooterProps> = () => {
  const collapsed = useSelector((state: RootState) => state.collapsed.value);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center pb-5">
      {collapsed ? (
        <StyledCollapsedSidebarFooter>
          <button className="sb-button" onClick={() => dispatch(sidebar())}>
            <ArrowSquareRight color="#001731" variant="Bulk" size={26} />
          </button>
        </StyledCollapsedSidebarFooter>
      ) : (
        <StyledSidebarFooter >
          <button className="sb-button" onClick={() => dispatch(sidebar())}>
            <ArrowSquareLeft color="#001731" variant="Bulk" size={26} />
          </button>
        </StyledSidebarFooter>
      )}
    </div>
  );
};

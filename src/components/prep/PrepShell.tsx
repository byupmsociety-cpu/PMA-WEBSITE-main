import { usePrep } from "@/hooks/usePrepState";
import LibraryView from "./library/LibraryView";
import AskOfficerSheet from "./people/AskOfficerSheet";
import PeopleView from "./people/PeopleView";
import PlanView from "./plan/PlanView";
import PrepBottomBar from "./PrepBottomBar";
import PrepSubnav from "./PrepSubnav";
import StepPage from "./step/StepPage";

const PrepShell = () => {
  const { view, stepId } = usePrep();
  return (
    <>
      <PrepSubnav />
      {view === "step" && stepId ? (
        <StepPage key={stepId} stepId={stepId} />
      ) : view === "library" ? (
        <LibraryView />
      ) : view === "people" ? (
        <PeopleView />
      ) : (
        <PlanView />
      )}
      <PrepBottomBar />
      <AskOfficerSheet />
    </>
  );
};

export default PrepShell;

import { FormEvent, useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import { moveArrayItem, RiskFactor, usePatient } from "@loophealth/api";

import {
  Button,
  Input,
  AdminEditorLayout,
  TextArea,
  IconTextTile,
  IconTextTileList,
} from "components";

import "./EditRiskFactorsRoute.css";

export const EditRiskFactorsRoute = () => {
  const { patient } = usePatient();

  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [riskFactorName, setRiskFactorName] = useState("");
  const [reasons, setReasons] = useState("");
  const [description, setDescription] = useState("");

  // Subscribe to risk factor updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const riskFactors = (snapshot.data()?.riskFactors ?? []) as RiskFactor[];
      setRiskFactors(riskFactors);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  // Add new risk factor.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newRiskFactor: RiskFactor = {
        name: riskFactorName,
        reasons,
        description,
      };
      const newRiskFactors = [...riskFactors, newRiskFactor];
      await updateDoc(patient.profileRef, { riskFactors: newRiskFactors });
      setRiskFactorName("");
      setReasons("");
      setDescription("");
    } catch (e) {
      alert(
        "There was an error adding the risk factor. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder risk factor within the list.
  const onMoveRiskFactor = async (index: number, direction: 1 | -1) => {
    if (!patient) {
      return;
    }

    if (index === 0 && direction === -1) {
      return;
    } else if (index === riskFactors.length - 1 && direction === 1) {
      return;
    }

    setIsLoading(true);
    try {
      const newRiskFactors = [...riskFactors];
      moveArrayItem(newRiskFactors, index, index + direction);
      await updateDoc(patient.profileRef, { riskFactors: newRiskFactors });
    } catch (e) {
      alert(
        "There was an error reordering this risk factor. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete risk factor.
  const onDeleteRiskFactor = async (index: number) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newRiskFactors = [...riskFactors];
      newRiskFactors.splice(index, 1);
      await updateDoc(patient.profileRef, { riskFactors: newRiskFactors });
    } catch (e) {
      alert(
        "There was an error deleting this risk factor. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminEditorLayout
      title="Risk Factors"
      renderLeft={() => (
        <form
          className="Utils__VerticalForm EditCarePlanRoute__Form"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="riskFactorName">
              Risk factor
            </label>
            <Input
              id="riskFactorName"
              type="text"
              value={riskFactorName}
              onChange={(e) => setRiskFactorName(e.target.value)}
              placeholder="e.g Diabetes"
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="reasons">
              Reasons (separated by comma)
            </label>
            <TextArea
              id="reasons"
              value={reasons}
              onChange={(e) => setReasons(e.target.value)}
              placeholder="eg. Family history, elevated HbA1c"
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="description">
              Description
            </label>
            <TextArea
              rows={10}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="eg. Changing your lifestyle could be a big step toward preventing diabetes — and it’s never too late to start. You can prevent diabetes completely you follow your care plan regularly."
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              Add risk factor
            </Button>
          </div>
        </form>
      )}
      renderRight={() => (
        <IconTextTileList>
          {riskFactors.map((riskFactor, index) => (
            <IconTextTile
              key={riskFactor.name}
              title={riskFactor.name}
              details={riskFactor.reasons}
              onReorder={(direction) => onMoveRiskFactor(index, direction)}
              onDelete={() => onDeleteRiskFactor(index)}
              isLoading={isLoading}
            />
          ))}
        </IconTextTileList>
      )}
    />
  );
};

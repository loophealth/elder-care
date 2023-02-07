import { FormEvent, useState } from "react";

import { AdminEditorLayout } from "components/AdminEditorLayout";
import { Input } from "components/Input";
import { TextArea } from "components/TextArea";

import "./EditRiskFactorsRoute.css";
import { Button } from "components/Button";

export const EditRiskFactorsRoute = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [riskFactor, setRiskFactor] = useState("");
  const [reasons, setReasons] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <AdminEditorLayout
      renderLeft={() => (
        <form
          className="Utils__VerticalForm EditCarePlanRoute__Form"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="riskFactor">
              Risk factor
            </label>
            <Input
              id="riskFactor"
              type="text"
              value={riskFactor}
              onChange={(e) => setRiskFactor(e.target.value)}
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
      renderRight={() => <div>Right</div>}
    />
  );
};

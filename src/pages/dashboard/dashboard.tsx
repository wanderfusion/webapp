import { TypographyH1 } from "@/components/ui/typography";
import { formatUsername } from "@/lib/utils";
import { useGetEmail, useGetUsername } from "@/redux/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalendarViewer from "../calendar/viewer";
import { useEffect, useState } from "react";
import { fetchPublicCalendars } from "@/network/nomadcore/client";
import { Calendar } from "@/network/nomadcore/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { PATHS } from "@/commons/constants";

export const Dashboard = () => {
  const email = useGetEmail();
  const rawUsername = useGetUsername();
  const username = formatUsername(rawUsername);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const navigate = useNavigate();
  const [selectedCalId, setSelectedCalId] = useState<string>("");
  const [selectedCalDateRange, setSelectedCalDateRange] = useState<Date[][]>(
    []
  );

  const handleSelect = (e: string) => {
    console.log(e);
    setSelectedCalId(e);
    const selectedDates = calendars
      .filter((x) => x.id === e)
      .at(0)
      ?.dates?.map((x) => [new Date(x.from), new Date(x.to)]);
    if (selectedDates !== undefined) {
      setSelectedCalDateRange(selectedDates);
    } else {
      setSelectedCalDateRange([]);
    }
  };

  useEffect(() => {
    fetchPublicCalendars()
      .then((data) => {
        if (data) {
          setCalendars(data?.calendars);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <TypographyH1>Hola, {username ? username : email}</TypographyH1>

      <div className="flex flex-row p-2 space-x-2">
        <div className="border p-2">
          <CalendarViewer dateRanges={selectedCalDateRange} />
        </div>

        <div className="flex flex-col">
          {calendars.length > 0 ? (
            <div className="selectCal">
              <Select onValueChange={handleSelect}>
                <SelectTrigger className="grow">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {calendars.map((x) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div></div>
          )}

          <div>
            {selectedCalId === "" ? (
              <div></div>
            ) : (
              <Button
                onClick={() =>
                  navigate(PATHS.UPDATE_CALENDAR, {
                    state: { calendarId: selectedCalId },
                  })
                }
              >
                Add Dates
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

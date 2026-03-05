import React from "react";
import { useUpdateEffect } from "react-use";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

interface Props {
  loadData?: boolean;
  returnData?: boolean;
}

export function useCMSCollections(props: Props) {
  const cmsData = useStoreState((state) => state.cms.formattedCollections);
  const setCMSData = useStoreActions(
    (actions) => actions.cms.formattedCollections.setPagesData,
  );

  const currentLanguage = "en";

  // Collections state
  const countrySummaryCMSData = useStoreState(
    (state) => state.cms.collections.countrySummary.data,
  );

  // Collections actions
  const countrySummaryCMSAction = useStoreActions(
    (actions) => actions.cms.collections.countrySummary.fetch,
  );

  function formatCMSData() {
    const items = [
      {
        key: "countrySummary",
        data: countrySummaryCMSData ?? {},
      },
    ];

    const formattedData: any = {
      countrySummary: [],
    };
    items.forEach((item) => {
      // @ts-expect-error TypeScript does not know the structure of item.data
      formattedData[item.key] = item.data.data?.filter(
        (d: any) => d.locale === currentLanguage,
      );
    });
    setCMSData(formattedData);
  }

  React.useEffect(() => {
    if (props.loadData) {
      countrySummaryCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}&pagination[page]=1&pagination[pageSize]=150`,
      });
    }
  }, []);

  useUpdateEffect(() => {
    if (props.loadData) {
      formatCMSData();
    }
  }, [countrySummaryCMSData]);

  if (props.returnData) {
    return cmsData;
  }

  return null;
}

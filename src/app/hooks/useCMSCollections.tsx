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
  const glossaryCMSData = useStoreState(
    (state) => state.cms.collections.glossary.data,
  );
  const changelogCMSData = useStoreState(
    (state) => state.cms.collections.changelog.data,
  );

  // Collections actions
  const countrySummaryCMSAction = useStoreActions(
    (actions) => actions.cms.collections.countrySummary.fetch,
  );
  const glossaryCMSAction = useStoreActions(
    (actions) => actions.cms.collections.glossary.fetch,
  );
  const changelogCMSAction = useStoreActions(
    (actions) => actions.cms.collections.changelog.fetch,
  );

  function formatCMSData() {
    const items = [
      {
        key: "countrySummary",
        data: countrySummaryCMSData ?? {},
      },
      {
        key: "glossary",
        data: glossaryCMSData ?? {},
      },
      {
        key: "changelog",
        data: changelogCMSData ?? {},
      },
    ];

    const formattedData: any = {
      countrySummary: [],
      glossary: [],
      changelog: [],
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
      glossaryCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}&pagination[page]=1&pagination[pageSize]=150`,
      });
      changelogCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}&pagination[page]=1&pagination[pageSize]=150`,
      });
    }
  }, []);

  useUpdateEffect(() => {
    if (props.loadData) {
      formatCMSData();
    }
  }, [countrySummaryCMSData, glossaryCMSData, changelogCMSData]);

  if (props.returnData) {
    return cmsData;
  }

  return null;
}

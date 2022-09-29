import { Keywords } from "./keywords";

interface BaseReporterOpts {
  markers: any;
  lines: string[];
  lineIndex: number;
  value: string;
}

interface ReporterOpts extends BaseReporterOpts {
  validRelations?: string[] | Record<string, Record<string, boolean>>;
  clause?: any;
  typeName?: string;
  reverse?: boolean;
}

interface ErrorReporterOpts extends BaseReporterOpts {
  message: string;
  customResolver?: (wordIdx: number, rawLine: string, value: string) => number;
  relatedInformation?: {
    type: string;
  };
}

const getValidRelationsArray = (validRelations?: ReporterOpts["validRelations"], typeName?: string): string[] => {
  if (!validRelations) {
    return [];
  }

  return Array.isArray(validRelations) ? validRelations : typeName ? Object.keys(validRelations?.[typeName]) : [];
};

const reportError = ({
  markers,
  lines,
  lineIndex,
  message,
  value,
  customResolver = undefined,
  relatedInformation = { type: "" },
}: ErrorReporterOpts) => {
  const rawLine = lines[lineIndex];
  const re = new RegExp("\\b" + value + "\\b");
  let wordIdx = rawLine.search(re) + 1;

  if (typeof customResolver === "function") {
    wordIdx = customResolver(wordIdx, rawLine, value);
  }

  markers.push({
    relatedInformation,
    // monaco.MarkerSeverity.Error,
    severity: 8,
    startColumn: wordIdx,
    endColumn: wordIdx + value.length,
    startLineNumber: lineIndex + 1,
    endLineNumber: lineIndex + 1,
    message,
    source: "linter",
  });
};

export const reportUseSelf = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: `For auto-referencing use '${Keywords.SELF}'.`,
    markers,
    lines,
    value,
    relatedInformation: { type: "self-error" },
    lineIndex,
    customResolver: (wordIdx, rawLine, value) => {
      const fromStartsAt = wordIdx;
      wordIdx = fromStartsAt + value.length + rawLine.slice(fromStartsAt + value.length).search(value) + 1;

      return wordIdx;
    },
  });
};

export const reportInvalidFrom = ({ markers, lines, lineIndex, value, clause }: ReporterOpts) => {
  reportError({
    message: `Cannot self-reference (\`${value}\`) within \`${Keywords.FROM}\` clause.`,
    markers,
    lines,
    value,
    lineIndex,
    customResolver: (wordIdx, rawLine, value) => {
      const fromStartsAt = rawLine.indexOf(clause);
      wordIdx = fromStartsAt + clause.length + rawLine.slice(fromStartsAt + clause.length).search(value) + 1;

      return wordIdx;
    },
  });
};

export const reportInvalidButNot = ({ markers, lines, lineIndex, value, clause }: ReporterOpts) => {
  reportError({
    message: `Cannot self-reference (\`${value}\`) within \`${Keywords.BUT_NOT}\` clause.`,
    markers,
    lineIndex,
    lines,
    value,
    customResolver: (wordIdx, rawLine, value) => {
      const fromStartsAt = rawLine.indexOf(clause);
      wordIdx = fromStartsAt + rawLine.slice(fromStartsAt, fromStartsAt + clause.length).lastIndexOf(value) + 1;

      return wordIdx;
    },
  });
};
export const reportInvalidRelationWithinClause = ({
  markers,
  lines,
  lineIndex,
  typeName,
  value,
  validRelations,
  clause,
  reverse = false,
}: ReporterOpts) => {
  const data = getValidRelationsArray(validRelations, typeName);
  const isInValid = !data?.includes(value);

  if (isInValid) {
    reportError({
      message: `The relation \`${value}\` does not exist${
        Array.isArray(validRelations) ? "." : ` in type \`${typeName}\``
      }`,
      markers,
      lines,
      value,
      lineIndex,
      customResolver: (wordIdx, rawLine, value) => {
        const clauseStartsAt = rawLine.indexOf(clause);
        wordIdx = clauseStartsAt + rawLine.slice(clauseStartsAt, clauseStartsAt + clause.length).indexOf(value) + 1;

        if (reverse) {
          wordIdx =
            clauseStartsAt + rawLine.slice(clauseStartsAt, clauseStartsAt + clause.length).lastIndexOf(value) + 1;
        }

        return wordIdx;
      },
    });
  }
};

export const reportInvalidRelation = ({ markers, lines, lineIndex, value, validRelations }: ReporterOpts) => {
  const data = getValidRelationsArray(validRelations);
  const isInValid = !data?.includes(value);
  if (isInValid) {
    reportError({
      markers,
      lines,
      lineIndex,
      value,
      message: `The relation \`${value}\` does not exist.`,
      relatedInformation: { type: "missing-definition", relation: value } as any,
    });
  }
};

export const reportDuplicate = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  const rawLine = lines[lineIndex];

  markers.push({
    relatedInformation: { type: "duplicated-error" },
    // monaco.MarkerSeverity.Error,
    severity: 8,
    startColumn: rawLine.indexOf(Keywords.DEFINE) + 1,
    endColumn: rawLine.length + 1,
    startLineNumber: lineIndex + 1,
    endLineNumber: lineIndex + 1,
    message: `Duplicate definition \`${value}\`.`,
    source: "linter",
  });
};

export const report = function ({ markers, lines }: Pick<BaseReporterOpts, "markers" | "lines">) {
  return {
    useSelf: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportUseSelf({ value, lineIndex, markers, lines }),

    invalidFrom: ({ lineIndex, value, clause }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidFrom({ value, clause, lineIndex, markers, lines }),

    invalidButNot: ({ lineIndex, value, clause }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidButNot({ lineIndex, value, clause, markers, lines }),

    duplicateDefinition: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportDuplicate({ lineIndex, value, markers, lines }),

    invalidRelation: ({ lineIndex, value, validRelations }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidRelation({
        lineIndex,
        value,
        validRelations,
        markers,
        lines,
      }),

    invalidRelationWithinClause: ({
      lineIndex,
      value,
      typeName,
      validRelations,
      clause,
      reverse,
    }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidRelationWithinClause({
        lineIndex,
        value,
        typeName,
        validRelations,
        clause,
        reverse,
        markers,
        lines,
      }),
  };
};

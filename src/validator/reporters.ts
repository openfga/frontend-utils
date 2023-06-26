import { Keyword, ReservedKeywords } from "../constants/keyword";
import { TransformedType } from "../parser";
import { ValidationError } from "./validation-error";
import type { editor } from "monaco-editor";

export interface Marker extends editor.IMarkerData {
  severity: number;
  startColumn: number;
  endColumn: number;
  startLineNumber: number;
  endLineNumber: number;
  message: string;
  source: string;
  extraInformation?: { error?: ValidationError; typeName?: string; relation?: string };
}

interface BaseReporterOpts {
  markers: Marker[];
  lines: string[];
  lineIndex: number;
  value: string;
}

interface ReporterOpts extends BaseReporterOpts {
  validRelations?: string[] | Record<string, TransformedType>;
  clause?: any;
  typeName?: string;
  relationName?: string;
  reverse?: boolean;
}

interface ErrorReporterOpts extends BaseReporterOpts {
  message: string;
  customResolver?: (wordIdx: number, rawLine: string, value: string) => number;
  extraInformation?: {
    error: ValidationError;
    typeName?: string;
    relation?: string;
  };
}

export const getDefaultError = (lines: string[]): Marker => {
  return {
    // monaco.MarkerSeverity.Error,
    severity: 8,
    startColumn: 0,
    endColumn: Number.MAX_SAFE_INTEGER,
    startLineNumber: 0,
    endLineNumber: lines.length,
    message: "Invalid syntax",
    source: "linter",
  };
};

const getValidRelationsArray = (validRelations?: ReporterOpts["validRelations"], typeName?: string): string[] => {
  if (!validRelations) {
    return [];
  }

  return Array.isArray(validRelations)
    ? validRelations
    : typeName
    ? Object.keys(validRelations?.[typeName].relations)
    : [];
};

const reportError = ({
  markers,
  lines,
  lineIndex,
  message,
  value,
  customResolver = undefined,
  extraInformation = { error: ValidationError.InvalidSyntax },
}: ErrorReporterOpts) => {
  const rawLine = lines[lineIndex];
  const re = new RegExp("\\b" + value + "\\b");
  let wordIdx = rawLine.search(re) + 1;

  if (typeof customResolver === "function") {
    wordIdx = customResolver(wordIdx, rawLine, value);
  }

  markers.push({
    extraInformation,
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

export const reportSchemaVersionRequired = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: "Schema version is required.",
    markers,
    lines,
    value,
    extraInformation: { error: ValidationError.SchemaVersionRequired },
    lineIndex,
  });
};

export const reportReservedTypeName = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: `A type cannot be named '${Keyword.SELF}' or '${ReservedKeywords.THIS}'.`,
    markers,
    lines,
    value,
    extraInformation: { error: ValidationError.ReservedTypeKeywords },
    lineIndex,
  });
};

export const reportReservedRelationName = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: `A relation cannot be named '${Keyword.SELF}' or '${ReservedKeywords.THIS}'.`,
    markers,
    lines,
    value,
    extraInformation: { error: ValidationError.ReservedRelationKeywords },
    lineIndex,
  });
};

export const reportUseSelf = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: `For auto-referencing use '${Keyword.SELF}'.`,
    markers,
    lines,
    value,
    extraInformation: { error: ValidationError.SelfError },
    lineIndex,
    customResolver: (wordIdx, rawLine, value) => {
      const fromStartsAt = wordIdx;
      wordIdx = fromStartsAt + value.length + rawLine.slice(fromStartsAt + value.length).search(value) + 1;

      return wordIdx;
    },
  });
};

export const reportInvalidName = ({ markers, lines, lineIndex, typeName, value, clause }: ReporterOpts) => {
  const errorMessage =
    (typeName ? `Relation '${value}' of type '${typeName}' ` : `Type '${value}' `) +
    `does not match naming rule: '${clause}'.`;
  reportError({
    message: errorMessage,
    markers,
    lines,
    value,
    extraInformation: { error: ValidationError.InvalidName },
    lineIndex,
  });
};

export const reportInvalidFrom = ({ markers, lines, lineIndex, value, clause }: ReporterOpts) => {
  reportError({
    message: `Cannot self-reference (\`${value}\`) within \`${Keyword.FROM}\` clause.`,
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

export const reportAllowedTypeModel10 = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  const rawLine = lines[lineIndex];
  const actualValue = rawLine.slice(rawLine.indexOf("["), rawLine.lastIndexOf("]") + 1);
  reportError({
    message: `Allowed types for relation '${value}' not valid for schema 1.0`,
    markers,
    lineIndex,
    lines,
    value: actualValue,
    extraInformation: { error: ValidationError.AllowedTypesNotValidOnSchema1_0 },
    customResolver: (wordIdx, rawLine, value) => {
      const clauseStartsAt = rawLine.indexOf(":") + ":".length + 1;
      wordIdx = clauseStartsAt + rawLine.slice(clauseStartsAt).indexOf(value.substring(1));
      return wordIdx;
    },
  });
};

export const reportAssignableRelationMustHaveTypes = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  const rawLine = lines[lineIndex];
  const actualValue = rawLine.includes("[")
    ? rawLine.slice(rawLine.indexOf("["), rawLine.lastIndexOf("]") + 1)
    : "self";
  reportError({
    message: `Assignable relation '${value}' must have types`,
    markers,
    lineIndex,
    lines,
    value: actualValue,
    extraInformation: { error: ValidationError.AssignableRelationsMustHaveType },
    customResolver: (wordIdx, rawLine, value) => {
      wordIdx = rawLine.indexOf(value.substring(1));
      return wordIdx;
    },
  });
};

export const reportMaximumOneDirectRelationship = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: "Each relationship must have at most 1 set of direct relations defined.",
    markers,
    lineIndex,
    lines,
    value,
    extraInformation: { error: ValidationError.AssignableRelationsMustHaveType },
    customResolver: (wordIdx, rawLine, value) => {
      wordIdx = rawLine.indexOf(value.substring(1));
      return wordIdx;
    },
  });
};

export const reportAssignableTypeWildcardRelation = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    message: `Type restriction '${value}' cannot contain both wildcard and relation`,
    markers,
    lineIndex,
    lines,
    value,
    extraInformation: { error: ValidationError.TypeRestrictionCannotHaveWildcardAndRelation },
  });
};

export const reportInvalidButNot = ({ markers, lines, lineIndex, value, clause }: ReporterOpts) => {
  reportError({
    message: `Cannot self-reference (\`${value}\`) within \`${Keyword.BUT_NOT}\` clause.`,
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
      extraInformation: { error: ValidationError.MissingDefinition, relation: value },
    });
  }
};

export const reportInvalidTypeRelation = ({
  markers,
  lines,
  lineIndex,
  value,
  typeName,
  relationName,
}: ReporterOpts) => {
  reportError({
    markers,
    lines,
    lineIndex,
    value,
    message: `\`${relationName}\` is not a valid relation for \`${typeName}\`.`,
    extraInformation: { error: ValidationError.InvalidRelationType, relation: relationName, typeName: typeName },
  });
};

export const reportInvalidType = ({ markers, lines, lineIndex, value, typeName }: ReporterOpts) => {
  reportError({
    markers,
    lines,
    lineIndex,
    value,
    message: `\`${typeName}\` is not a valid type.`,
    extraInformation: { error: ValidationError.InvalidType, typeName: typeName },
  });
};

export const noEntryPoint = ({ markers, lines, lineIndex, value, validRelations }: ReporterOpts) => {
  const data = getValidRelationsArray(validRelations);
  const isInValid = !data?.includes(value);
  if (isInValid) {
    reportError({
      markers,
      lines,
      lineIndex,
      value,
      message: `\`${value}\` is an impossible relation (no entrypoint).`,
      extraInformation: { error: ValidationError.RelationNoEntrypoint, relation: value },
    });
  }
};

export const reportTupleUsersetRequireDirect = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    markers,
    lines,
    lineIndex,
    value,
    message: `\`${value}\` relation used inside from allows only direct relation.`,
    extraInformation: { error: ValidationError.TuplesetNotDirect, relation: value },
    customResolver: (wordIdx, rawLine, value) => {
      const clauseStartsAt = rawLine.indexOf("from") + "from".length + 1;
      wordIdx = clauseStartsAt + rawLine.slice(clauseStartsAt).indexOf(value) + 1;
      return wordIdx;
    },
  });
};

export const reportDuplicate = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  const rawLine = lines[lineIndex];

  markers.push({
    extraInformation: { error: ValidationError.DuplicatedError },
    // monaco.MarkerSeverity.Error,
    severity: 8,
    startColumn: rawLine.indexOf(Keyword.DEFINE) + 1,
    endColumn: rawLine.length + 1,
    startLineNumber: lineIndex + 1,
    endLineNumber: lineIndex + 1,
    message: `Duplicate definition \`${value}\`.`,
    source: "linter",
  });
};

export const reportInvalidSyntaxVersion = ({ markers, lines, lineIndex, value }: ReporterOpts) => {
  reportError({
    markers,
    lines,
    lineIndex,
    value,
    message: `Invalid schema ${value}`,
    extraInformation: { error: ValidationError.InvalidSchema },
  });
};

export const report = function ({ markers, lines }: Pick<BaseReporterOpts, "markers" | "lines">) {
  return {
    schemaVersionRequired: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportSchemaVersionRequired({ value, lineIndex, markers, lines }),

    useSelf: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportUseSelf({ value, lineIndex, markers, lines }),

    invalidName: ({ lineIndex, value, clause, typeName }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidName({ value, lineIndex, markers, lines, clause, typeName }),

    reservedType: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportReservedTypeName({ value, lineIndex, markers, lines }),

    reservedRelation: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportReservedRelationName({ value, lineIndex, markers, lines }),

    invalidFrom: ({ lineIndex, value, clause }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidFrom({ value, clause, lineIndex, markers, lines }),

    invalidButNot: ({ lineIndex, value, clause }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidButNot({ lineIndex, value, clause, markers, lines }),

    tupleUsersetRequiresDirect: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportTupleUsersetRequireDirect({ lineIndex, value, markers, lines }),

    duplicateDefinition: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportDuplicate({ lineIndex, value, markers, lines }),

    noEntryPoint: ({ lineIndex, value, typeName }: Omit<ReporterOpts, "markers" | "lines">) =>
      noEntryPoint({ lineIndex, value, typeName, markers, lines }),

    invalidTypeRelation: ({ lineIndex, value, typeName, relationName }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidTypeRelation({ lineIndex, value, typeName, relationName, markers, lines }),

    invalidType: ({ lineIndex, value, typeName }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidType({ lineIndex, value, typeName, markers, lines }),

    invalidSchemaVersion: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportInvalidSyntaxVersion({ lineIndex, value, markers, lines }),

    allowedTypeModel10: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportAllowedTypeModel10({ lineIndex, markers, lines, value }),

    assignableRelationMustHaveTypes: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportAssignableRelationMustHaveTypes({ lineIndex, markers, lines, value }),

    maximumOneDirectRelationship: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportMaximumOneDirectRelationship({ lineIndex, markers, lines, value }),

    assignableTypeWildcardRelation: ({ lineIndex, value }: Omit<ReporterOpts, "markers" | "lines">) =>
      reportAssignableTypeWildcardRelation({ lineIndex, markers, lines, value }),

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

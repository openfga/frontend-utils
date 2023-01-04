import { SINGLE_INDENTATION } from "../formatter/indent-dsl";
import { Keyword } from "../constants/keyword";

export const DefaultOneDotOneModel = `${Keyword.MODEL}
${SINGLE_INDENTATION}${Keyword.SCHEMA} 1.1
${Keyword.TYPE} user
${Keyword.TYPE} group
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}member: [user]
${Keyword.TYPE} folder
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}parent: [folder]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}owner: [user, group#member]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}viewer: [user, group#member] ${Keyword.OR} owner ${Keyword.OR} viewer ${Keyword.FROM} parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}create_file: owner
${Keyword.TYPE} doc
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}parent: [doc]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}owner: [user, group#member]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}viewer: [user, group#member]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}read: viewer ${Keyword.OR} owner ${Keyword.OR} viewer ${Keyword.FROM} parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}write: owner ${Keyword.OR} owner ${Keyword.FROM} parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}share: owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}change_owner: owner`;

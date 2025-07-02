/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Matrix of Destiny Interpretations Dictionary
 *
 * This file contains detailed interpretations for each Major Arcana (1-22)
 * in the context of specific Matrix of Destiny aspects/themes.
 */

import {
  incomeStreamsInterpretations,
  type MatrixInterpretation,
  type MatrixAspectInterpretations,
} from "./incomeStreamsInterpretations";
import { moneyBlocksInterpretations } from "./moneyBlocksInterpretations";
import { workLifeBalanceInterpretations } from "./workLifeBalanceInterpretations";
import { ingredientsForLoveInterpretations } from "./ingredientsForLoveInterpretations";
import { pastLifeIncomeInterpretations } from "./pastLifeIncomeInterpretations";
import { sexualityInterpretations } from "./sexualityInterpretations";
import { powerOfAncestorsInterpretations } from "./powerOfAncestorsInterpretations";
import { momsTalentsInterpretations } from "./momsTalentsInterpretations";
import { dadsTalentsInterpretations } from "./dadsTalentsInterpretations";
import { comfortZoneInterpretations } from "./comfortZoneInterpretations";
import { pastLifeMoneyMindsetInterpretations } from "./pastLifeMoneyMindsetInterpretations";
import { selfExpressionInterpretations } from "./selfExpressionInterpretations";
import { inspirationInterpretations } from "./inspirationInterpretations";
import { higherSelfInterpretations } from "./higherSelfInterpretations";
import { heartsWishesInterpretations } from "./heartsWishesInterpretations";
import { dadsKarmaInterpretations } from "./dadsKarmaInterpretations";
import { momsKarmaInterpretations } from "./momsKarmaInterpretations";
import { presentLifeTaskInterpretations } from "./presentLifeTaskInterpretations";
import { pastLifeMistakesInterpretations } from "./pastLifeMistakesInterpretations";
import { futureChildrenInterpretations } from "./futureChildrenInterpretations";
import { asAParentInterpretations } from "./asAParentInterpretations";
import { destinyInterpretations } from "./destinyInterpretations";
import { biggestObstacleInterpretations } from "./biggestObstacleInterpretations";
import { reputationInterpretations } from "./reputationInterpretations";

export type { MatrixInterpretation, MatrixAspectInterpretations };

/**
 * Get interpretation for specific arcana number in given aspect
 */
export const getMatrixInterpretation = (
  aspect:
    | "incomeStreams"
    | "moneyBlocks"
    | "workLifeBalance"
    | "ingredientsForLove"
    | "pastLifeIncome"
    | "sexuality"
    | "powerOfAncestors"
    | "momsTalents"
    | "dadsTalents"
    | "comfortZone"
    | "pastLifeMoneyMindset"
    | "selfExpression"
    | "inspiration"
    | "higherSelf"
    | "heartsWishes"
    | "dadsKarma"
    | "momsKarma"
    | "presentLifeTask"
    | "pastLifeMistakes"
    | "futureChildren"
    | "asAParent"
    | "destiny"
    | "biggestObstacle"
    | "reputation",
  arcanaNumber: number
): MatrixInterpretation | null => {
  const aspectMap = {
    incomeStreams: incomeStreamsInterpretations,
    moneyBlocks: moneyBlocksInterpretations,
    workLifeBalance: workLifeBalanceInterpretations,
    ingredientsForLove: ingredientsForLoveInterpretations,
    pastLifeIncome: pastLifeIncomeInterpretations,
    sexuality: sexualityInterpretations,
    powerOfAncestors: powerOfAncestorsInterpretations,
    momsTalents: momsTalentsInterpretations,
    dadsTalents: dadsTalentsInterpretations,
    comfortZone: comfortZoneInterpretations,
    pastLifeMoneyMindset: pastLifeMoneyMindsetInterpretations,
    selfExpression: selfExpressionInterpretations,
    inspiration: inspirationInterpretations,
    higherSelf: higherSelfInterpretations,
    heartsWishes: heartsWishesInterpretations,
    dadsKarma: dadsKarmaInterpretations,
    momsKarma: momsKarmaInterpretations,
    presentLifeTask: presentLifeTaskInterpretations,
    pastLifeMistakes: pastLifeMistakesInterpretations,
    futureChildren: futureChildrenInterpretations,
    asAParent: asAParentInterpretations,
    destiny: destinyInterpretations,
    biggestObstacle: biggestObstacleInterpretations,
    reputation: reputationInterpretations,
  };

  return aspectMap[aspect]?.[arcanaNumber] || null;
};

/**
 * Get all available aspects
 */
export const getAvailableAspects = () =>
  [
    "incomeStreams",
    "moneyBlocks",
    "workLifeBalance",
    "ingredientsForLove",
    "pastLifeIncome",
    "sexuality",
    "powerOfAncestors",
    "momsTalents",
    "dadsTalents",
    "comfortZone",
    "pastLifeMoneyMindset",
    "selfExpression",
    "inspiration",
    "higherSelf",
    "heartsWishes",
    "dadsKarma",
    "momsKarma",
    "presentLifeTask",
    "pastLifeMistakes",
    "futureChildren",
    "asAParent",
    "destiny",
    "biggestObstacle",
    "reputation",
  ] as const;

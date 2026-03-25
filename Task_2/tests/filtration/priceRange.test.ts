import { test } from "@playwright/test";
import {ListAdsPage} from "../../pages/listAdsPage/listAdsPage";

const priceRange = {
    minValue: 1000,
    maxValue: 5000,
    negativeValue: -900,
};

test("Применение фильтра Диапазон цен с минимальным и максимальным значениями", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.inputPriceRange(priceRange.minValue, priceRange.maxValue);

    //assert
    await listAdsPage.checkPriceRange(priceRange.minValue, priceRange.maxValue);
});

test("Применение фильтра Диапазон цен с максимальным значением", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.inputPriceRange(undefined, priceRange.maxValue);

    //assert
    await listAdsPage.checkPriceRange(undefined, priceRange.maxValue);
});

test("Применение фильтра Диапазон цен с минимальным значением", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.inputPriceRange(priceRange.minValue, undefined);

    //assert
    await listAdsPage.checkPriceRange(priceRange.minValue, undefined);
});

test("Валидация фильтра со значением границ наоборот", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.inputPriceRange(priceRange.maxValue, priceRange.minValue);

    //assert
    await listAdsPage.adsNotFound();
});

test("Ввод отрицательного значения в фильтре Диапазон цен", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.inputPriceRange(undefined, priceRange.negativeValue);

    //assert
    await listAdsPage.adsNotFound();
});

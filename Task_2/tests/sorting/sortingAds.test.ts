import { test } from "@playwright/test";
import {ListAdsPage} from "../../pages/listAdsPage/listAdsPage";

const testData = {
    categorySelect: "0", //электроника
    allCategories: "", //все категории
    categoryCheck: "Электроника",
    cardPriority: "Срочно",
};

test("Сортировка по цене по возрастанию", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.selectFilterPrice();
    await listAdsPage.selectFilterAscending();

    //assert
    await listAdsPage.cardsSortedByPriceAsc();
});

test("Сортировка по цене по убыванию", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.selectFilterPrice();
    await listAdsPage.selectFilterDescending();

    //assert
    await listAdsPage.cardsSortedByPriceDesc();
});

test("Применение фильтра Категория при существующем объявлении", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.selectFilterCategory(testData.categorySelect);

    //assert
    await listAdsPage.getAllValueCategories(testData.categoryCheck);
});

test("Применение фильтра Все категории в разделе Категории", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.selectFilterCategory(testData.allCategories);

    //assert
    await listAdsPage.multipleCategories();
});

test("Применение тогла Только срочные", async ({ page }) => {
    //arange
    const listAdsPage = new ListAdsPage(page);

    //act
    await listAdsPage.openAdsPage();
    await listAdsPage.selectOnlyUrgent();

    //assert
    await listAdsPage.allCardsHavePriority(testData.cardPriority);
});

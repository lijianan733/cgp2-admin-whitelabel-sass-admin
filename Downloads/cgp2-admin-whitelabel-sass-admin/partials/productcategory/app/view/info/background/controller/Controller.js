/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.productcategory.view.info.background.controller.Controller', {
    categoryAddBackgroundSeries: function (backgroundId, categoryId, grid) {
        var controller = this;
        var url = adminPath + 'api/productCategories/' + categoryId + '/backgroundSeries?seriesId=' + backgroundId;
        JSAjaxRequest(url, 'POST', false, null, i18n.getKey('addsuccessful'), function () {
        })
    },
    deleteCategoryBackground: function (backgroundId, categoryId, grid) {
        var controller = this;
        var url = adminPath + 'api/productCategories/' + categoryId + '/backgroundSeries/' + backgroundId;
        JSAjaxRequest(url, 'Delete', false, null, i18n.getKey('deleteSuccess'), function () {
            grid.store.load();
        })

    }
})
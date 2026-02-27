Ext.define('CGP.shippingquotationtemplatemanage.controller.Controller', {
    createId: function () {
        var id = JSGetCommonKey(false);
        return id;
    },
//    创建areaQtyShippingConfigs单元格模板dom
    /**
     * @description
     * @param itemeName
     * */
    rendererEle: function (itemeName, areaQtyShippingConfigsData) {
        var itemsArray = [];
        areaQtyShippingConfigsData.forEach(function (item) {
            var temp = '<div class="areaQtyShippingConfigs-td">' + item[itemeName] + '</div>'
            itemsArray.push(temp);
        });
        var elements = '<div class="areaQtyShippingConfigs-container">' + itemsArray.join('') + '</div>'
        return elements;
    }
})

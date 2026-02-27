/**
 * @author nan
 * @date 2025/5/21
 * @description TODO
 */
Ext.define("CGP.product_price_component.controller.Controller", {
    /**
     * 获取系统默认价格组件配置，分stage production
     * @returns {{Stage: null, Production: null}}
     */
    getSystemDefaultConfig: function () {
        var defaultConfig = {
            Stage: null,
            Production: null,
        };
        /*    {
                "_id": 257799404,
                "clazz": "com.qpp.cgp.domain.partner.price.SystemPriceComponent",
                "createdDate": 1744954284606,
                "createdBy": "40488402",
                "modifiedDate": 1747791368441,
                "modifiedBy": "140800",
                "productPriceComponent": {
                "clazz": "com.qpp.cgp.domain.product.price.ProductPriceComponent",
                    "modifiedDate": 1747791368441
            },
                "applicationMode": "Stage",
                "status": 1
            }*/
        var url = adminPath + 'api/systemPriceComponents?page=1&start=0&limit=25';
        JSAjaxRequest(url, "GET", false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var result = responseText?.data?.content;
                    if (result) {
                        result.map(function (item) {
                            if (item.applicationMode == 'Stage') {
                                defaultConfig.Stage = item;
                            } else if (item.applicationMode == 'Production') {
                                defaultConfig.Production = item;
                            }
                        });
                    }
                }
            }
        });
        return defaultConfig;
    },
    setSystemDefaultConfig: function (env, configId, currentId, callback) {
        var method = 'POST';
        var url = adminPath + 'api/systemPriceComponents';
        if (configId) {
            method = 'PUT';
            url = url + '/' + configId;
        }
        var jsonData = {
            _id: configId,
            "clazz": "com.qpp.cgp.domain.partner.price.SystemPriceComponent",
            "productPriceComponent": {
                "_id": currentId,
                "clazz": "com.qpp.cgp.domain.product.price.ProductPriceComponent"
            },
            "applicationMode": env,
            "status": 1//是否启用 1 代表启用
        };
        JSAjaxRequest(url, method, true, jsonData, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callback ? callback() : null;
                }
            }
        }, true);
    }
});
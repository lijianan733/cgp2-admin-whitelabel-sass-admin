/**
 * @Description:
 * @author nan
 * @date 2022/9/15
 */
Ext.define('CGP.cost.controller.Controller', {
    /**
     * 统一显示内容
     * @param value
     * @param agr
     * @returns {string}
     */
    commonRender: function (value, agr) {
        if (!Ext.isEmpty(value)) {
            return arguments[1].column.summaryType + ':' + value.toFixed(2);
        }
    },
    /**
     * 查指定周期总成本图表
     * @param startTime
     * @param endTime
     */
    showCostChart: function (startTime, endTime) {
        var startTime = parseInt(startTime);
        var endTime = parseInt(endTime);
        var str = Ext.Date.format(new Date(startTime), 'Y-m-d') + ' ~ ' + Ext.Date.format(new Date(endTime), 'Y-m-d');
        var beginDate = new Date(startTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var endDate = new Date(endTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var url = chartPath + "reports/powerbi/dashboard/test/manufacture_cost/total/01" +
            `?rs:Embed=true&filter=date_table_cost/Date ge datetime'${beginDate}' and date_table_cost/Date le datetime'${endDate}'`;
        console.log(url);
        JSOpen({
            id: '总成本明细(周期：' + str + ')',
            url: url,
            title: '总成本明细(周期：' + str + ')',
            refresh: true
        })
    },
    /**
     * 显示产品分类的统计图表
     * @param catalogId
     * @param catalogName
     * @param type total/average,总数/平均
     * @param startTime
     * @param endTime
     */
    showCatalogCostChart: function (catalogId, catalogName, type, startTime, endTime) {
        var startTime = parseInt(startTime);
        var endTime = parseInt(endTime);
        var map = {
            total: '总',
            average: '平均'
        };
        var beginDate = new Date(startTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var endDate = new Date(endTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var url = chartPath + `reports/powerbi/dashboard/test/manufacture_cost/${type}/02` +
            `?rs:Embed=true&filter=date_table_cost/Date ge datetime'${beginDate}' and date_table_cost/Date le datetime'${endDate}'` +
            `manufacture_x0020_sales_product_type/Product_Type_Id eq ${catalogId}`;
        console.log(url);
        JSOpen({
            id: '分类' + map[type] + '成本分析图表(分类：' + catalogName + ')',
            url: url,
            title: '分类' + map[type] + '成本分析图表(分类：' + catalogName + ')',
            refresh: true
        })
    },

    /**
     * 查看可配置产品的统计图表
     */
    showConfigurableProductCostChart: function (productId, type, startTime, endTime) {
        var startTime = parseInt(startTime);
        var endTime = parseInt(endTime);
        var productId = JSGetQueryString('productId');
        var map = {
            total: '总',
            average: '平均'
        };
        var beginDate = new Date(startTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var endDate = new Date(endTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var url = chartPath + `reports/powerbi/dashboard/test/manufacture_cost/${type}/03` +
            `?rs:Embed=true&filter=date_table_cost/Date ge datetime'${beginDate}' and date_table_cost/Date le datetime'${endDate}'` +
            `manufacture_x0020_sales_product_type/Configurable_Product_Id eq ${productId}`;
        console.log(url);
        JSOpen({
            id: '可配置产品' + map[type] + '成本分析图表(产品Id：' + productId + ')',
            url: url,
            title: '可配置产品' + map[type] + '成本分析图表(产品Id：' + productId + ')',
            refresh: true
        })

    },
    /**
     * 查看SKU产品的统计图表
     */
    showSKUProductCostChart: function (productId, type, startTime, endTime) {
        var startTime = parseInt(startTime);
        var endTime = parseInt(endTime);
        var productId = JSGetQueryString('productId');
        var map = {
            total: '总',
            average: '平均'
        };
        var beginDate = new Date(startTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var endDate = new Date(endTime + 8 * 3600 * 1000).toISOString().replace('Z', '');
        var url = chartPath + `reports/powerbi/dashboard/test/manufacture_cost/${type}/04` +
            `?rs:Embed=true&filter=date_table_cost/Date ge datetime'${beginDate}' and date_table_cost/Date le datetime'${endDate}'` +
            `manufacture_x0020_sales_product_type/Product_Id eq ${productId}`;
        console.log(url);
        JSOpen({
            id: '产品' + map[type] + '成本分析图表(产品Id：' + productId + ')',
            url: url,
            title: '产品' + map[type] + '成本分析图表(产品Id：' + productId + ')',
            refresh: true
        })
    },
    /**
     * 显示工序历史平均成本的统计图表
     */
    showProcessCostChart: function (costName, processId, processName) {
        var url = chartPath + "reports/powerbi/dashboard/test/manufacture_cost/average/05" +
            `?rs:Embed=true&filter=` +
            `manufacture_x0020_manufacture_order_cost/Cost_Item_Id eq '${costName}' and ` +
            `manufacture_x0020_manufacture_order_cost/Item_Name_Id eq ${processId}`;
        console.log(url);
        JSOpen({
            id: processName + '的' + i18n.getKey(costName) + '的历史平均成本',
            url: url,
            title: processName + '的' + i18n.getKey(costName) + '的历史平均成本',
            refresh: true
        })
    }
    ,
    /**
     * 查看物料的平均成本
     * @param startTime
     * @param endTime
     */
    showMaterialCostChart: function (materialId) {
        var url = chartPath + "reports/powerbi/dashboard/test/manufacture_cost/average/05" +
            `?rs:Embed=true&filter=` +
            `manufacture_x0020_manufacture_order_cost/Cost_Item_Id eq 'materialCost' and ` +
            `manufacture_x0020_manufacture_order_cost/Item_Name_Id eq ${materialId}`;
        console.log(url);
        JSOpen({
            id: '物料历史平均成本分析图表(物料Id：' + i18n.getKey(materialId) + ')',
            url: url,
            title: '物料历史平均成本分析图表(物料Id：' + i18n.getKey(materialId) + ')',
            refresh: true
        })
    }
})
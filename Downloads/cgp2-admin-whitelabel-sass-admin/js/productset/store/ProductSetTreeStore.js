/**
 * Created by nan on 2021/4/6
 */
Ext.define('CGP.productset.store.ProductSetTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.productset.model.ProductSetTreeNodeModel',
    nodeParam: '_id',
    root: {
        _id: 'root',
        name: ''
    },
    productConfigDesignId: null,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/productsuittrees/{nodeType}/{id}/Items',
        reader: {
            type: 'json',
            root: 'data'
        },
        /**
         *
         * 自己定义其组成url的方式
         * @param request
         * @returns {*}
         */
        buildUrl: function (request) {
            var mapping = {
                'com.qpp.cgp.domain.productssuit.ConfigurableProductSet': 'PRODUCT_SUIT',
                'com.qpp.cgp.domain.productssuit.SkuProductSet': 'PRODUCT_SUIT',
                'com.qpp.cgp.domain.productssuit.MultiSetItem': 'PRODUCT_SUIT_ITEM',
                'com.qpp.cgp.domain.productssuit.SingleSetItem': 'PRODUCT_SUIT_ITEM',
                'com.qpp.cgp.domain.productssuit.CompleteSetItem': 'PRODUCT_SUIT_ITEM',
                'com.qpp.cgp.domain.productssuit.StaticProductScope': 'PRODUCT_SUIT_SCOPE',
                'com.qpp.cgp.domain.productssuit.MainCategoryProductScope': 'PRODUCT_SUIT_SCOPE',
                'com.qpp.cgp.domain.productssuit.SubCategoryProductScope': 'PRODUCT_SUIT_SCOPE'
            }
            var url = adminPath + 'api/productsuittrees/{nodeType}/{id}/Items';
            var me = this,
                operation = request.operation,
                records = operation.records || [],
                record = records[0],
                proxy = request.proxy,
                format = me.format,
                node = operation.node,
                id = record ? record.getId() : operation.id;
            var clazz = node.get('clazz');
            url = url.replace('{id}', id);
            url = url.replace('{nodeType}', mapping[clazz]);

            if (format) {
                if (!url.match(/\.$/)) {
                    url += '.';
                }

                url += format;
            }
            request.url = url;
            return request.url;
        },
    },
    constructor: function (config) {
        var me = this;
        if (config) {
            if (config.nodeType) {
                me.proxy.url = me.proxy.url.replace('{nodeType}', config.nodeType);
            }
            if (config.nodeId) {
                me.proxy.url = me.proxy.url.replace('{nodeId}', config.nodeId);
            }
        }
        this.callParent(arguments);
    }
})

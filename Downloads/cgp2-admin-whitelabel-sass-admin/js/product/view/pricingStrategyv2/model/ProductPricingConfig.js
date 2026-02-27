/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.ProductPricingConfig", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.pricing.configuration.ProductPricingConfig"
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'strategies',
            type: 'array',
            convert: function (value, record) {
                //partner的配置优先用strategiesDocuments,把实例数据导入到strategies里面
                var strategiesDocuments = record.raw['strategiesDocuments'];
                var strategies = value;
                if (strategiesDocuments) {
                    for (var i = 0; i < strategies.length; i++) {
                        var strategyId = strategies[i]._id;
                        for (var k = 0; k < strategiesDocuments.length; k++) {
                            if (strategiesDocuments[k]._id == strategyId) {
                                strategies[i] = Ext.Object.merge(strategiesDocuments[k], strategies[i]);
                            }
                        }
                    }
                }
                return strategies;
            }
        },
        //这是partner那边的接口中保存完整价格策略的配置
        {
            name: 'strategiesDocuments',
            type: 'array'
        }
    ]

})
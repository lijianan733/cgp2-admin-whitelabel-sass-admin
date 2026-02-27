/**
 * Created by nan on 2020/7/7.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.config.Config', {
    statics: {
        data: [
            {
                "_id": 9558741,
                "singleJobConfigs": [
                    {
                        "_id": 9351331,
                        "clazz": "com.qpp.job.domain.config.SingleJobConfig",
                        "name": "uno卡110张排版",
                        "isMixed": false,
                        "context": {
                            "_id": "9839737",
                            "attributesToRtTypes": [],
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                        },
                        "pages": [
                            {
                                pageConfigId: 9351472
                            },
                            {
                                pageConfigId: 9351309
                            }

                        ],
                        "jobType": "CMYK"
                    },
                    {
                        "_id": 9548833,
                        "pages": [],
                        "name": "123",
                        "description": "123123",
                        "context": {
                            "_id": "9839737",
                            "attributesToRtTypes": [],
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                        },
                        "pageGroupConfig": {
                            "key": {
                                "resultType": "String",
                                "expressionEngine": "JavaScript",
                                "inputs": [],
                                "expression": "123123",
                                "clazz": "com.qpp.cgp.expression.Expression"
                            },
                            "clazz": "com.qpp.job.domain.config.page.KeyExpressionPageGroupConfig"
                        },
                        "pageFilterConfig": {
                            "filter": {
                                "resultType": "Boolean",
                                "expressionEngine": "JavaScript",
                                "inputs": [],
                                "expression": "123123",
                                "clazz": "com.qpp.cgp.expression.Expression"
                            },
                            "clazz": "com.qpp.job.domain.config.page.ExpressionPageFilterConfig"
                        },
                        "jobLaunchTrigger": {
                            "seconds": 12321312,
                            "clazz": "com.qpp.job.domain.config.launch.DelayLaunchTrigger"
                        },
                        "isMixed": true,
                        "jobType": "CMYK",
                        "clazz": "com.qpp.job.domain.config.SingleJobConfig",
                    }
                ],
                "name": "12312",
                "description": "3123213",
                "pageGroupConfig": {
                    "key": {
                        "resultType": "Boolean",
                        "expressionEngine": "JavaScript",
                        "inputs": [],
                        "expression": "1232131",
                        "clazz": "com.qpp.cgp.expression.Expression"
                    },
                    "clazz": "com.qpp.job.domain.config.page.KeyExpressionPageGroupConfig"
                },
                "pageFilterConfig": {
                    "filter": {
                        "resultType": "String",
                        "expressionEngine": "JavaScript",
                        "inputs": [],
                        "expression": "123213",
                        "clazz": "com.qpp.cgp.expression.Expression"
                    },
                    "clazz": "com.qpp.job.domain.config.page.ExpressionPageFilterConfig"
                },
                "isMixed": false,
                "clazz": "com.qpp.job.domain.config.CompositeJobConfig",
            }
        ],
        functionTemplate: function expression(args) {
            var pavs = args.context.lineItems[0].productAttributeValues;
            var getValueByAttrId = function (attrId) {
                for (var idx in pavs) {
                    if (pavs[idx].attributeId == attrId) {
                        return pavs[idx].attributeValue;
                    }
                }
            };
            var getOptionIdByAttrId = function (attrId) {
                for (var idx in pavs) {
                    if (pavs[idx].attributeId == attrId) {
                        return pavs[idx].attributeOptionIds;
                    }
                }
            };
            var getOptionIdsByAttrId = function (attrId) {
                for (var idx in pavs) {
                    if (pavs[idx].attributeId == attrId) {
                        return pavs[idx].attributeOptionIds.split(',');
                    }
                }
            };
            // 获取单选属性（8127646）的属性值(选项id), 返回的是字符串类型的id，PS-返回的都是字符串类型(输入，单选)或字符串数组（多选）
            var standardTilesMaterialOptionId = getOptionIdByAttrId('8127646');

            return standardTilesMaterialOptionId == '8127648';
        }
    }
})

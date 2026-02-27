/**
 * Created by nan on 2020/11/30
 */
Ext.Loader.syncRequire('CGP.product.view.managerskuattribute.model.SkuAttributeGridModel')
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.TestData", {
    operation: {
        "clazz": "com.qpp.cgp.domain.executecondition.operation.LogicalOperation",
        "operations": [{
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 133729,
                "skuAttributeId": 15105992,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": true,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "==",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }, {
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 133729,
                "skuAttributeId": 15105992,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": 'afdasdf',
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "==",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }, {
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 133729,
                "skuAttributeId": 15105992,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": "133730,133731",
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "In",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }, {
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 1976299,
                "skuAttributeId": 15105994,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": "1976945,1976946",
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "==",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }, {
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 1976299,
                "skuAttributeId": 15105994,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": "1976945,1976946",
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "!=",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }, {
            "clazz": "com.qpp.cgp.domain.executecondition.operation.CompareOperation",
            "operations": [{
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue",
                "attributeId": 1976299,
                "skuAttributeId": 15105994,
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue"
            }, {
                "clazz": "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                "value": "1976946,1976945,1976947,1976300",
                "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
            }],
            "operationType": "simple",
            "operator": "In",
            "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.CompareOperation"
        }],
        "operator": "AND",
        "multilingualKey": "com.qpp.cgp.domain.executecondition.operation.LogicalOperation"
    },
    skuAttributeStore: Ext.create('Ext.data.Store', {
        model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
        proxy: {
            type: 'memory'
        },
        data: [{
            "id": 15105992,
            "displayName": "Paper Type",
            "sortOrder": 0,
            "attribute": {
                "id": 133729,
                "name": "Paper Type",
                "required": true,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 133730,
                    "name": "18 point card stock(Medium)",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "18 point card stock(Medium)",
                    "displayValue": "18 point card stock(Medium)",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 133731,
                    "name": "20 point card stock(Heavy)",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "20 point card stock(Heavy)",
                    "displayValue": "20 point card stock(Heavy)",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "Function_Pentagon_box_Paper_Type",
                "showInFrontend": true,
                "sortOrder": 0,
                "valueType": "String",
                "selectType": "SINGLE",
                "optionsBySet": [{
                    "id": 133730,
                    "name": "18 point card stock(Medium)",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "18 point card stock(Medium)",
                    "displayValue": "18 point card stock(Medium)",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 133731,
                    "name": "20 point card stock(Heavy)",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "20 point card stock(Heavy)",
                    "displayValue": "20 point card stock(Heavy)",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "required": true,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }, {
            "id": 15105993,
            "displayName": "Finish",
            "sortOrder": 1,
            "attribute": {
                "id": 133726,
                "name": "Finish",
                "required": true,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 133727,
                    "name": "Matt Finish",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "Matt Finish",
                    "displayValue": "Matt Finish",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 133728,
                    "name": "Gloss Finish",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "Gloss Finish",
                    "displayValue": "Gloss Finish",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "Function_Pentagon_box_Finish",
                "showInFrontend": true,
                "sortOrder": 0,
                "valueType": "String",
                "selectType": "SINGLE",
                "optionsBySet": [{
                    "id": 133727,
                    "name": "Matt Finish",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "Matt Finish",
                    "displayValue": "Matt Finish",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 133728,
                    "name": "Gloss Finish",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "Gloss Finish",
                    "displayValue": "Gloss Finish",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "required": true,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }, {
            "id": 15105994,
            "displayName": "11",
            "sortOrder": 2,
            "attribute": {
                "id": 1976299,
                "name": "11",
                "required": false,
                "inputType": "CheckBox",
                "validationExp": "",
                "options": [{
                    "id": 1976945,
                    "name": "123123",
                    "sortOrder": 0,
                    "imageUrl": "123123",
                    "value": "123123",
                    "displayValue": "12312",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976946,
                    "name": "123123",
                    "sortOrder": 0,
                    "imageUrl": "123123",
                    "value": "23123123",
                    "displayValue": "1231231",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976947,
                    "name": "123",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "213123",
                    "displayValue": "123123",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976300,
                    "name": "11",
                    "sortOrder": 0,
                    "imageUrl": "111",
                    "value": "1111",
                    "displayValue": "11",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "11",
                "showInFrontend": false,
                "sortOrder": 11,
                "valueType": "String",
                "selectType": "MULTI",
                "optionsBySet": [{
                    "id": 1976945,
                    "name": "123123",
                    "sortOrder": 0,
                    "imageUrl": "123123",
                    "value": "123123",
                    "displayValue": "12312",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976946,
                    "name": "123123",
                    "sortOrder": 0,
                    "imageUrl": "123123",
                    "value": "23123123",
                    "displayValue": "1231231",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976947,
                    "name": "123",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "213123",
                    "displayValue": "123123",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 1976300,
                    "name": "11",
                    "sortOrder": 0,
                    "imageUrl": "111",
                    "value": "1111",
                    "displayValue": "11",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "required": false,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }, {
            "id": 15105995,
            "displayName": "Packaging weight",
            "sortOrder": 3,
            "attribute": {
                "id": 1579119,
                "name": "Packaging weight",
                "required": false,
                "inputType": "TextField",
                "validationExp": "",
                "options": [],
                "code": "Packaging weight_MPC",
                "showInFrontend": false,
                "sortOrder": 12,
                "valueType": "String",
                "selectType": "NON",
                "optionsBySet": [],
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "required": false,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }, {
            "id": 15105996,
            "displayName": "13",
            "sortOrder": 4,
            "attribute": {
                "id": 8988075,
                "name": "13",
                "required": false,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 8988076,
                    "name": "12312",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "312321",
                    "displayValue": "",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "13",
                "showInFrontend": false,
                "sortOrder": 123,
                "valueType": "Boolean",
                "selectType": "SINGLE",
                "optionsBySet": [{
                    "id": 8988076,
                    "name": "12312",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "312321",
                    "displayValue": "",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "required": false,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }]
    })
})

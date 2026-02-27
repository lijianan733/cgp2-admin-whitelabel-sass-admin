/**
 * @Description:
 * @author nan
 * @date 2023/11/30
 */
Ext.define("CGP.common.condition.config.Config", {
    statics: {
        'deleteAttribute': {
            key: '属性被删',
            type: 'skuAttribute',
            valueType: 'String',
            selectType: 'NON',
            attrOptions: [],
            required: false,
            isSku: false,//boolean
            displayName: '属性被删',//显示的是属性id，sku属性显示名称
            path: 'args.context',//该属性在上下文中的路径
            keyType: 'skuId',
            id: '属性被删',
            code: '属性被删',
            attributeInfo: {
                inputType: 'textfield',
                "id": '属性被删',
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "name": '属性被删',
                "required": false,
                "options": [],
                "code": '属性被删',
                "valueType": 'String',
                "selectType": "NON",
            },
            name: '属性被删',
            attribute: {
                inputType: 'textfield',
                "id": '属性被删',
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "name": '属性被删',
                "required": false,
                "options": [],
                "code": '属性被删',
                "valueType": 'String',
                "selectType": "NON",
            }
        }
    }
})
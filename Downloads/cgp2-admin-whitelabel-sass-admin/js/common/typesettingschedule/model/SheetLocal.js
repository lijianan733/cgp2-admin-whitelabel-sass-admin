/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.common.typesettingschedule.model.SheetLocal", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'templateId',
            type: 'int'
        },
        {
            name: 'impressionTemplateId',
            type: 'int'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'sortOrder',
            type: 'int'
        },
        {
            name: 'content',
            type: 'string'
        },
        {
            name: 'impressionSortOrder',
            type: 'int'
        },
        {
            name: 'file',
            type: 'string'
        },
        {
            name: 'placeHolders',
            type: 'object'
        },
        {
            name: 'emptyPlaceHolderFillStrategy',
            type: 'string'
        },
        {
            name: 'fillStrategy',
            type: 'string'
        },
        {
            name: 'composingOrder',
            type: 'int'
        },
        {
            name: 'md5',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.impression.sheet.ImpressionSheet'
        }
    ]
});
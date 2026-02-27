/**
 * @Description:
 * @author nan
 * @date 2022/5/25
 */
Ext.define('CGP.cmsconfig.model.ProductAttributeTreeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    nodeParam: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true,
            convert: function (value, record) {
                //处理在不同层级中属性的Id相同的情况
                if (value) {
                    return value + new Date().getTime();
                }
            }
        },
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string'
        }, {
            name: 'code',
            type: 'string'
        },
        {
            name: 'icon',
            type: 'string',
            convert: function (value, record) {
                var clazz = record.raw.clazz;
                if (clazz == "com.qpp.cgp.domain.attribute.Attribute") {
                    return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                } else {
                    return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_red.png';
                }
            }
        },
    ],
});

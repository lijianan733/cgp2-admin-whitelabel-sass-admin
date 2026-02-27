/**
 * Created by nan on 2019/10/31.
 * 被影响属性规则的fieldset
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyArrayFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.DiyFieldSet',
    alias: 'widget.constraintofattributepropertyarrayfieldset',
    collapsible: false,
    header: false,
    autoScroll: true,
    style: {
        borderRadius: '10px'
    },
    isCanAddOrDelete: true,//是否可以对属性的property进行添加和删除，修改
    requires: ['CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyFieldSet'],
    profileDatas: null,
    linksStore: null,
    selectedMappingLinks: null,//记录映射规则所属的mappingLinks，属性所属的mappingLink在该数组中选择
    initComponent: function () {
        var me = this;
        me.selectedMappingLinks = Ext.getCmp('mappingLinks').getSubmitValue() || [];
        var extraFilter = '';
        extraFilter = '{"name":"includeIds","value":"[' + me.selectedMappingLinks.toString() + ']","type":"string"}';
        me.linksStore = Ext.create('CGP.product.store.MappingLinks', {
            params: {
                filter:
                    '[' +
                    '{"name":"productId","value":' + me.productId + ',"type":"number"}' + (',' + extraFilter) +
                    ']'
            }
        });
        var attributeContainerArr = [];
        for (var i in me.rightAttributes) {
            var attributeContainer = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyFieldSet', {
                title: me.rightAttributes[i].attributeName,
                skuAttribute: me.rightAttributes[i],
                width: 400,
                isCanAddOrDelete: me.isCanAddOrDelete,
                linksStore: me.linksStore,
                linkShow: me.linkShow
            });
            attributeContainerArr.push(attributeContainer);
        }
        me.items = attributeContainerArr;
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = [];
        for (var i = 0; i < me.items.items.length; i++) {
            result = result.concat(me.items.items[i].getValue());
        }
        return result;
    },
    /**
     * 重新把数据安装照skuAttribute分类
     * @param data
     */
    setValue: function (data) {
        var me = this;
        var attributeContainerArr = [];
        for (var i = 0; i < data.length; i++) {
            var attributeContainer = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyFieldSet', {
                title: data[i].skuAttribute.attributeName,
                skuAttribute: data[i].skuAttribute,
                width: 400,
                value: data[i].data,
                isCanAddOrDelete: me.isCanAddOrDelete,
                valueExchange: me.valueExchange,
                linksStore: me.linksStore,
                linkShow: me.linkShow
            });
            attributeContainerArr.push(attributeContainer);
        }
        me.add(attributeContainerArr);
    }
})

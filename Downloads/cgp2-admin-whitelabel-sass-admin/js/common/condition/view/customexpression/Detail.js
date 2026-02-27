/**
 * @Description:
 * @author nan
 * @date 2023/10/20
 */

Ext.define('CGP.common.condition.view.customexpression.Detail', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.detail',
    itemId: 'detail',
    header: {
        title: '<font color="green">sku属性详情</font>',
        style: {
            background: '#f5f5f5'
        }
    },
    defaults: {
        xtype: 'displayfield',
        readOnly: true,
        editable: false,
        grow: true,
        labelWidth: 100,
        preventScrollbars: true,
        margin: '5 25'
    },
    refreshData: function (record) {
        var me = this;
        if (record) {
            var detailInfo = record.getData().attributeInfo.attribute;
            var skuInfo = record.getData().attributeInfo;
            var data = {
                skuId: skuInfo.id,
                skuCode: skuInfo.code,
                skuDisplayName: skuInfo.displayName
            };
            me.setValue(Ext.Object.merge(data, detailInfo));
        } else {
            me.setValue({});
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: 'sku属性Id',
                name: 'skuId',
                value: '',
            },
            {
                xtype: 'displayfield',
                fieldLabel: 'sku属性显示名',
                name: 'skuDisplayName',
                value: '',
            },
            {
                xtype: 'displayfield',
                fieldLabel: 'sku属性Code',
                name: 'skuCode',
                value: '',
            },
            {
                xtype: 'displayfield',
                fieldLabel: '属性Id',
                name: 'id',
                value: '',
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(`<a href="#" style="color: blue">${data}</a>`);
                    } else {
                        this.setValue(``);
                    }
                },
                listeners: {
                    change: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        if (ela) {
                            var id = a.innerText;
                            ela.on("click", function (event) {
                                JSOpen({
                                    id: 'attributepage',
                                    url: path + 'partials/attribute/attribute.html?attributeId=' + id,
                                    title: i18n.getKey('attribute'),
                                    refresh: true
                                });
                            });
                        }
                    }
                }
            },
            {
                fieldLabel: '属性名',
                name: 'name',
                value: ''
            },
            {
                fieldLabel: '代码',
                name: 'code',
                value: ''
            },
            {
                fieldLabel: '值类型',
                name: 'valueType',
                value: ''
            },
            {
                fieldLabel: '值输入方式',
                name: 'selectType',
                value: '',
                diySetValue: function (data) {
                    var selectType = '';
                    if (data == 'NON') {
                        selectType = '手动输入';
                    } else if (data == 'SINGLE') {
                        selectType = '单选';
                    } else if (data == 'MULTI') {
                        selectType = '多选';
                    }
                    this.setValue(selectType);
                }
            }
        ];
        me.callParent();
    }
})
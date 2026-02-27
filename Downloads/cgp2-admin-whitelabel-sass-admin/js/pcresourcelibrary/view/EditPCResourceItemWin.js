/**
 * Created by nan on 2021/9/4
 */
Ext.Loader.setPath('CGP.resource', '../resource/app');
Ext.Loader.syncRequire([
    'CGP.common.field.MultiLanguageField',
    'CGP.resource.view.dynamicSizeImage.ImageField',
    'CGP.pcresourcelibrary.store.PCResourceCategoryTreeStore',
    'CGP.pcresourcelibrary.view.ResourceGridCombo',
])
Ext.define("CGP.pcresourcelibrary.view.EditPCResourceItemWin", {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    record: null,
    layout: {type: 'fit'},
    createOrEdit: 'create',
    resourceItemGrid: null,
    resourceLibraryId: null,//关联的库
    resourceType: null,//添加的资源类型
    categoryId: null,
    listeners: {
        afterrender: function (win) {
            if (win.record) {
                var form = win.items.items[0];
                form.setValue(win.record.getData());
            }
        }
    },
    initComponent: function () {
        var me = this;
        if (me.record) {
            me.createOrEdit = 'edit';
        }
        var languageStore = Ext.create('CGP.language.store.LanguageStore');
        var displayDescriptionType = (me.resourceType.indexOf('Color') != -1) ? 'com.qpp.cgp.domain.pcresource.DisplayColor' : 'com.qpp.cgp.domain.pcresource.DisplayImage';
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('resources');
        me.items = [{
            xtype: 'errorstrickform',
            defaults: {
                margin: '5 25 10 25',
                width: 450,
            },
            isValidForItems: true,//是否校验时用item.forEach来处理
            items: [
                {
                    xtype: 'textfield',
                    name: 'library',
                    itemId: 'library',
                    hidden: true,
                    value: me.resourceLibraryId,
                    fieldLabel: i18n.getKey('pcResourceLibrary'),
                    diyGetValue: function () {
                        var data = this.getValue();
                        return {
                            _id: data,
                            clazz: 'com.qpp.cgp.domain.pcresource.PCResourceLibrary'
                        }
                    },
                    diySetValue: function (data) {
                        var id = data._id;
                        this.setValue(id);
                    }
                },
                {
                    xtype: 'resourcegridcombo',
                    fieldLabel: i18n.getKey('resources'),
                    allowBlank: false,
                    name: 'resource',
                    resourceType: me.resourceType,
                    itemId: 'resource',
                    listeners: {
                        change: function (gridCombo, newValue, oldValue) {
                            var form = gridCombo.ownerCt;
                            var thumbnail = form.query('fileupload[itemId=thumbnail]')[0];
                            var id = gridCombo.getSubmitValue()[0];
                            if (id) {
                                var recordData = gridCombo.store.getById(id)?.raw;
                               ;
                                if (recordData) {
                                    var newThumbnail = recordData.thumbnail;
                                    if (newThumbnail) {
                                        //有缩略图字段
                                        var oldThumbnail = thumbnail.getValue();
                                        if (oldThumbnail && oldThumbnail != newThumbnail) {
                                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否使用当前资源的缩略图?', function (selector) {
                                                if (selector == 'yes') {
                                                    thumbnail.setValue(newThumbnail);
                                                }
                                            })
                                        } else {
                                            thumbnail.setValue(newThumbnail);
                                        }

                                    }
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'displayDescription',
                    itemId: 'displayDescription',
                    defaults: {
                        width: '100%'
                    },
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'multilanguagefield',
                            name: 'displayName',
                            allowBlank: false,
                            itemId: 'displayName',
                            fieldLabel: i18n.getKey('displayName')
                        },
                        {
                            xtype: 'fileuploadv2',
                            name: 'thumbnail',
                            itemId: 'thumbnail',
                            valueUrlType: 'part',
                            allowBlank: false,
                            hidden: displayDescriptionType != 'com.qpp.cgp.domain.pcresource.DisplayImage',
                            disabled: displayDescriptionType != 'com.qpp.cgp.domain.pcresource.DisplayImage',
                            fieldLabel: i18n.getKey('thumbnail')
                        },
                        {
                            xtype: 'uxcolorfield',
                            name: 'colorCode',
                            itemId: 'colorCode',
                            allowBlank: false,
                            readOnly: true,
                            hidden: displayDescriptionType == 'com.qpp.cgp.domain.pcresource.DisplayImage',
                            disabled: displayDescriptionType == 'com.qpp.cgp.domain.pcresource.DisplayImage',
                            fieldLabel: i18n.getKey('color')
                        },
                        {
                            xtype: 'combo',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            valueField: 'value',
                            displayField: 'display',
                            value: displayDescriptionType,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        display: 'com.qpp.cgp.domain.pcresource.DisplayImage',
                                        value: 'DisplayImage'
                                    },
                                    {
                                        display: 'com.qpp.cgp.domain.pcresource.DisplayColor',
                                        value: 'DisplayColor'
                                    }
                                ]
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var colorCode = combo.ownerCt.getComponent('colorCode');
                                    var thumbnail = combo.ownerCt.getComponent('thumbnail');
                                    var isDisplayImage = (newValue == 'com.qpp.cgp.domain.pcresource.DisplayImage');
                                    thumbnail.setVisible(isDisplayImage);
                                    thumbnail.setDisabled(!isDisplayImage);
                                    colorCode.setVisible(!isDisplayImage);
                                    colorCode.setDisabled(isDisplayImage);
                                },
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: '_id',
                    itemId: '_id',
                    hidden: true,
                    fieldLabel: i18n.getKey('_id')
                },
                {
                    xtype: 'categorygridcombo',
                    fieldLabel: i18n.getKey('category'),
                    name: 'category',
                    itemId: 'category',
                    allowBlank: true,
                    categoryId: me.categoryId,
                    hidden: !Ext.isEmpty(me.categoryId),
                    resourceType: me.resourceType,
                },
                {
                    xtype: 'arraydatafield',
                    name: 'tag',
                    itemId: 'tag',
                    resultType: 'Array',//该组件获取结果和设置值的数据类型
                    fieldLabel: i18n.getKey('tags')
                },
                {
                    name: 'languageFilter',
                    xtype: 'gridcombo',
                    itemId: 'languageFilter',
                    displayField: 'name',
                    valueField: 'id',
                    msgTarget: 'side',
                    flex: 1,
                    store: languageStore,
                    matchFieldWidth: false,
                    editable: false,
                    multiSelect: true,
                    valueType: 'idReference',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('支持的语言'),
                    tipInfo: '为空时表示支持所有语言',
                    gridCfg: {
                        height: 300,
                        width: 500,
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                xtype: 'gridcolumn',
                                itemId: 'id',
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                xtype: 'gridcolumn',
                                itemId: 'name',
                            }, {
                                text: i18n.getKey('locale'),
                                dataIndex: 'locale',
                                xtype: 'gridcolumn',
                                itemId: 'locale',
                                renderer: function (v) {
                                    if (v) {
                                        return v.name + '(' + v.code + ')';
                                    }
                                }
                            }, {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                xtype: 'gridcolumn',
                                itemId: 'code',
                                flex: 1,
                                renderer: function (v) {
                                    return v.code;
                                }
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: languageStore,
                            displayInfo: true,
                            displayMsg: '',
                            emptyMsg: i18n.getKey('noData')
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getArrayValue();
                    },
                    diySetValue: function (data) {
                        var me = this;
                        var ids = [];
                        if (data && data.length > 0) {
                            data.forEach(function (item) {
                                ids.push(item.id);
                            })
                        }
                        me.setInitialValue(ids);
                    }
                },

                {
                    xtype: 'textfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.pcresource.PCResourceItem',
                    fieldLabel: i18n.getKey('clazz')
                }
            ]
        }];
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                handler: function (btn) {
                    var controller = Ext.create('CGP.pcresourcelibrary.controller.Controller');
                    var win = btn.ownerCt.ownerCt;
                    var form = win.items.items[0];
                    if (form.isValid()) {
                        var data = form.getValue();
                        controller.savePCResourceItem(data, win);
                    }
                }
            }
        }
        me.callParent();
    }
})
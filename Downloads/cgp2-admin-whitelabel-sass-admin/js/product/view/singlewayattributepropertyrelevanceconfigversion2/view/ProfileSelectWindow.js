/**
 * Created by admin on 2019/12/27.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ProfileSelectWindow',{
    extend: 'Ext.window.Window',
    requires:[],
    modal: true,
    resizable: false,
    constrain: true,
    minWidth: 400,
    height: 200,
    defaults: {
        labelAlign: 'left',
        labelWidth:100,
        msgTarget: 'side',
        validateOnChange: false
    },
    bodyStyle: {
        padding: '10px'
    },

    initComponent: function () {
        var me = this;
        me.title=i18n.getKey('select')+i18n.getKey('profile');

        me.items = [
            {
                xtype:'combo',
                fieldLabel: i18n.getKey('profile'),
                itemId:'attributeProfile',
                name: 'attributeProfile',
                store:Ext.data.StoreManager.get('profileStore'),
                valueField: '_id',
                displayField: 'displayName',
                queryMode: 'local',
                width: 300,
                autoSelect:true,
                editable: false,
                haveReset:true,
                allowBlank :false,
                emptyText :i18n.getKey('select')+i18n.getKey('profile')
            }
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var wind=btn.ownerCt.ownerCt;
                    var comboProfile=wind.getComponent('attributeProfile');
                    if(comboProfile.isValid()){
                        var attPropertys=[];
                        var attPropertyValue={
                            _id:null,
                            clazz: "com.qpp.cgp.domain.attributeproperty.AttributePropertyValue",
                            propertyPath:{
                                _id:null,
                                clazz:'com.qpp.cgp.domain.attributeproperty.PropertyPathDto',
                                EntryLink : null,
                                skuAttributeId:0,
                                skuAttribute:{},
                                propertyName:'Value',
                                attributeProfile:{
                                    "clazz" : "com.qpp.cgp.domain.attributeconfig.AttributeProfile",
                                    "idReference" : "AttributeProfile",
                                    "_id" : comboProfile.getValue(),
                                    "name" : comboProfile.getRawValue()
                                }
                            },
                            value:null,
                            isInclude:true
                        };
                        attPropertys.push(attPropertyValue);
                        me.treeGrid.setValue(attPropertys);
                        wind.close();
                    }
                    else{
                        Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('noSelect')+i18n.getKey('profile'))
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }];
        me.callParent(arguments);

    }
})

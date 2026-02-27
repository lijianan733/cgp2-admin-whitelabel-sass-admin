/**
 * Created by nan on 2020/11/6
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.CommonFontFieldSet',
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.CommonFontColorFieldSet',
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.CommonBackgroundColorFieldSet'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.ResourceConfigForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.resourceconfigform',
    autoScroll: true,
    defaults: {
        width: 850,
        margin: '5 25 20 25'
    },
    rawData: null,
    getValue: function () {
        var me = this;
        if (me.rendered == true) {
            var result = {
                builderViewResourceConfig: {
                    clazz: 'com.qpp.cgp.domain.product.config.v2.builder.BuilderViewResourceConfig',
                    fonts: null,
                    fontConfigType: null,
                    fontColors: null,
                    fontColorConfigType: null,
                    backgroundColors: null,
                    bgColorConfigType: null,
                    defaultFont: null,
                }
            };
            var fontResourceData = me.getComponent('font').getValue();
            var fontColorData = me.getComponent('fontColor').getValue();
            var backgroundColorData = me.getComponent('backgroundColor').getValue();
            if (fontResourceData) {
                //级联的，如果字体或者颜色没选，则资源类型也不需要传
                if (fontResourceData.supportFonts && fontResourceData.supportFonts.length > 0) {
                    result.builderViewResourceConfig.fonts = fontResourceData.supportFonts;
                    result.builderViewResourceConfig.fontConfigType = fontResourceData.resourceConfigType;
                }
                result.builderViewResourceConfig.defaultFont = fontResourceData.defaultFont;
            }
            if (fontColorData) {
                if (fontColorData.colors && fontColorData.colors.length > 0) {
                    result.builderViewResourceConfig.fontColors = fontColorData.colors;
                    result.builderViewResourceConfig.fontColorConfigType = fontColorData.resourceConfigType;
                }

            }
            if (backgroundColorData) {
                if (backgroundColorData.colors && backgroundColorData.colors.length > 0) {
                    result.builderViewResourceConfig.backgroundColors = backgroundColorData.colors;
                    result.builderViewResourceConfig.bgColorConfigType = backgroundColorData.resourceConfigType;
                }
            }
            console.log(result);
            return result;
        } else {
            return {
                builderViewResourceConfig: me.rawData || {
                    clazz: 'com.qpp.cgp.domain.product.config.v2.builder.BuilderViewResourceConfig'
                }
            };
        }
    },
    setValue: function (data) {
        var me = this;
        var builderViewResourceConfig = data.builderViewResourceConfig;
        me.rawData = builderViewResourceConfig;
        var fontData = {
            supportFonts: builderViewResourceConfig.fonts,
            resourceConfigType: builderViewResourceConfig.fontConfigType,
            defaultFont: builderViewResourceConfig.defaultFont
        };
        var fontColorData = {
            colors: builderViewResourceConfig.fontColors,
            resourceConfigType: builderViewResourceConfig.fontColorConfigType
        };
        var backgroundData = {
            colors: builderViewResourceConfig.backgroundColors,
            resourceConfigType: builderViewResourceConfig.bgColorConfigType
        };
        var fontResource = me.getComponent('font');
        var fontColor = me.getComponent('fontColor');
        var backgroundColor = me.getComponent('backgroundColor');
        fontColor.setValue(fontColorData)
        fontResource.setValue(fontData);
        backgroundColor.setValue(backgroundData);
    },
    isValid: function () {
        var me = this;
        return true;
        /*
                if (me.rendered == true) {
                    return me.callParent();
                } else {
                    var data = me.getValue();
                    if (data.builderViewResourceConfig && data.builderViewResourceConfig.defaultFont) {
                        return true;
                    } else {
                        return false;
                    }
                }
        */
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'commonfontfieldset',
                name: 'font',
                itemId: 'font',
                id: 'productCommonFonts',
                title: i18n.getKey('font'),
                legendItemConfig: {
                    disabledBtn: {
                        hidden: true,
                        disabled: false,
                        isUsable: true,//初始化时，是否是禁用
                    }
                },
            },
            {
                xtype: 'commonfontcolorfieldset',
                name: 'fontColor',
                itemId: 'fontColor',
                minHeight: 40,
                title: i18n.getKey('font') + i18n.getKey('color'),
            },
            {
                xtype: 'commonbackgroundcolorfieldset',
                name: 'backgroundColor',
                itemId: 'backgroundColor',
                minHeight: 40,
                title:  i18n.getKey('color'),
            }
        ];
        me.callParent();
    }
})
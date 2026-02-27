/**
 * Created by nan on 2020/11/5
 */
Ext.Loader.syncRequire([
    'CGP.buildercommonresource.view.FontColorGrid',
    'CGP.buildercommonresource.view.FontPanel',
    'CGP.buildercommonresource.view.BackgroundColorGrid',
    'CGP.buildercommonresource.view.FontLanguageNavigate',
    'CGP.buildercommonresource.view.BgSizeDefferenceGrid'
])
Ext.define('CGP.buildercommonresource.view.CommonResourceTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.commonresourcetab',
    items: [
        {
            xtype: 'fontpanel',
            title: i18n.getKey('font')
        }, {
            xtype: 'fontlanguagenavigate',
            title: i18n.getKey('语言可用字体规则')
        }, {
            xtype: 'fontcolorgrid',
            title: i18n.getKey('font') + i18n.getKey('color'),
        }, {
            xtype: 'backgroundcolorgrid',
            title:  i18n.getKey('color'),
        }, {
            xtype: 'bgsizedefferencegrid',
            title: i18n.getKey('allowableDeviation'),
        }
    ],
})
function get_ores_chart_html() {
    let temp_HTML_Text = "<div>";
    temp_HTML_Text = temp_HTML_Text + "<div id='ores_menu_title'>Ores Chart<span id='Exit_Button' onclick='minimize_Ores_Panel()'>X</span></div>";

    temp_HTML_Text = temp_HTML_Text + `
<table id='ores_chart'>
  <colgroup>
    <col data-column="1" id='categories_column'>
    <col id='sodium_column'>
    <col id='carbon_column'>
    <col id='aluminium_columm'>
    <col id='silicon_column'>
    <col id='scandium_column'>
    <col id='titanium_column'>
    <col id='vanadium_column'>
    <col id='zirconium_column'>
    <col id='chromium_column'>
    <col id='manganese_column'>
    <col id='iron_column'>
    <col id='niobium_column'>
    <col id='nickel_column'>
    <col id='copper_column'>
    <col id='molybdenum_column'>
    <col id='lead_column'>
    <col id='tungsten_column'>
    <col id='gold_column'>
    <col id='rhenium_column'>
    <col id='platinum_column'>
  </colgroup>
<!-- row 0   -->
 <tr id="ores_chart">
 <td data-column="1" id="ores_chart">Hex Color Code</td>
 <td id="ores_chart">#daffff</td>
 <td id="ores_chart">#70efff</td>
 <td id="ores_chart">#70eeff</td>
 <td id='ores_chart'>#70eeff</td>
 <td id='ores_chart'>#4bd5ff</td>
 <td id='ores_chart'>#1bb4ff</td>
 <td id='ores_chart'>#1cc2ff</td>
 <td id='ores_chart'>#2cc9ff</td>
 <td id='ores_chart'>#20e775</td>
 <td id='ores_chart'>#20e778</td>
 <td id='ores_chart'>#23f45b</td>
 <td id='ores_chart'>#61a31a</td>
 <td id='ores_chart'>#8fba1b</td>
 <td id='ores_chart'>#8eba1a</td>
 <td id='ores_chart'>#f4e026</td>
 <td id='ores_chart'>#ffb51a</td>
 <td id='ores_chart'>#ff6a1b</td>
 <td id='ores_chart'>#ff6d20</td>
 <td id='ores_chart'>#d02233</td>
 <td id='ores_chart'>#9c1a41</td>
</tr> 
<!-- row 1   -->
 <tr id="ores_chart">
 <td id="ores_chart">RGB Color Code</td>
 <td id='ores_chart'>218-255-255</td>
 <td id='ores_chart'>112-239-255</td>
 <td id='ores_chart'>112-238-255</td>
 <td id='ores_chart'>112-238-255</td>
 <td id='ores_chart'>75-213-255</td>
 <td id='ores_chart'>27-180-255</td>
 <td id='ores_chart'>28-194-255</td>
 <td id='ores_chart'>44-201-255</td>
 <td id='ores_chart'>32-231-117</td>
 <td id='ores_chart'>32-231-120</td>
 <td id='ores_chart'>35-244-91</td>
 <td id='ores_chart'>97-163-26</td>
 <td id='ores_chart'>143-186-27</td>
 <td id='ores_chart'>142-186-26</td>
 <td id='ores_chart'>244-224-38</td>
 <td id='ores_chart'>255-181-26</td>
 <td id='ores_chart'>255-106-27</td>
 <td id='ores_chart'>255-109-32</td>
 <td id='ores_chart'>208-34-51</td>
 <td id='ores_chart'>156-26-65</td>
 </tr> 
<!-- row 2   -->
 <tr id="ores_chart">
 <td id="ores_chart">Density kg/L
</td><td id='ores_chart'>9.68
</td><td id='ores_chart'>2.27
</td><td id='ores_chart'>2.27
</td><td id='ores_chart'>2.33
</td><td id='ores_chart'>2.99
</td><td id='ores_chart'>4.51
</td><td id='ores_chart'>6.00
</td><td id='ores_chart'>6.52
</td><td id='ores_chart'>7.19
</td><td id='ores_chart'>7.21
</td><td id='ores_chart'>7.85
</td><td id='ores_chart'>8.57
</td><td id='ores_chart'>8.91
</td><td id='ores_chart'>8.96
</td><td id='ores_chart'>10.28
</td><td id='ores_chart'>11.34
</td><td id='ores_chart'>19.30
</td><td id='ores_chart'>19.30
</td><td id='ores_chart'>21.02
</td><td id='ores_chart'>21.45
</td></tr> 
<!-- row 3   -->
 <tr id="ores_chart">
 <td id="ores_chart">Tier
</td><td id='ores_chart'>1
</td><td id='ores_chart'>1
</td><td id='ores_chart'>2
</td><td id='ores_chart'>1
</td><td id='ores_chart'>3
</td><td id='ores_chart'>5
</td><td id='ores_chart'>5
</td><td id='ores_chart'>4
</td><td id='ores_chart'>3
</td><td id='ores_chart'>4
</td><td id='ores_chart'>1
</td><td id='ores_chart'>5
</td><td id='ores_chart'>2
</td><td id='ores_chart'>3
</td><td id='ores_chart'>4
</td><td id='ores_chart'>2
</td><td id='ores_chart'>2
</td><td id='ores_chart'>4
</td><td id='ores_chart'>5
</td><td id='ores_chart'>3
</td></tr> 
<!-- row 4   -->
 <tr id="ores_chart">
 <td id="ores_chart">Market Bot Price
</td><td id='ores_chart'>0.48
</td><td id='ores_chart'>0.48
</td><td id='ores_chart'>2.40
</td><td id='ores_chart'>0.48
</td><td id='ores_chart'>12.00
</td><td id='ores_chart'>300.00
</td><td id='ores_chart'>300.00
</td><td id='ores_chart'>60.00
</td><td id='ores_chart'>12.00
</td><td id='ores_chart'>60.00
</td><td id='ores_chart'>0.48
</td><td id='ores_chart'>300.00
</td><td id='ores_chart'>2.40
</td><td id='ores_chart'>12.00
</td><td id='ores_chart'>60.00
</td><td id='ores_chart'>2.40
</td><td id='ores_chart'>2.40
</td><td id='ores_chart'>60.00
</td><td id='ores_chart'>300.00
</td><td id='ores_chart'>12.00
</td></tr> 
<!-- row 5   -->
 <tr id="ores_chart">
 <td id="ores_chart">Appearance
</td><td id='ores_chart'><img src="https://i.imgur.com/0y3JmFA.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/MvZQ6D9.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/JTAQael.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/wJ6ZLpf.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/zOZMurJ.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/EVyucnK.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/phoeeyJ.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/d8TmvQW.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/g7S3oHO.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/DCjC95M.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/mhXxyhV.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/CFtvC3b.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/dLiXyAP.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/XDJJlp7.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/UcfMB0B.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/orON8hx.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/0RKNHtm.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/gQop6wM.png" alt="Trulli" id='ores_chart_img'> 
</td><td id='ores_chart'><img src="https://i.imgur.com/an24LwY.png" alt="Trulli" id='ores_chart_img'>
</td><td id='ores_chart'><img src="https://i.imgur.com/L5s1xmd.png" alt="Trulli" id='ores_chart_img'> 
</td></tr> 
<!-- row 6   -->
 <tr id="ores_chart">
 <td id="ores_chart">Ores
</td><td id='ores_chart'>Sodium
</td><td id='ores_chart'>Carbon
</td><td id='ores_chart'>Aluminium
</td><td id='ores_chart'>Silicon
</td><td id='ores_chart'>Scandium
</td><td id='ores_chart'>Titanium
</td><td id='ores_chart'>Vanadium
</td><td id='ores_chart'>Zirconium
</td><td id='ores_chart'>Chromium
</td><td id='ores_chart'>Manganese
</td><td id='ores_chart'>Iron
</td><td id='ores_chart'>Niobium
</td><td id='ores_chart'>Nickel
</td><td id='ores_chart'>Copper
</td><td id='ores_chart'>Molybdenum
</td><td id='ores_chart'>Lead
</td><td id='ores_chart'>Tungsten
</td><td id='ores_chart'>Gold
</td><td id='ores_chart'>Rhenium
</td><td id='ores_chart'>Platinum
</td></tr> 
<!-- row 7   -->
 <tr id="ores_chart">
 <td id="ores_chart">Alioth
</td><td id='ores_chart'>64 - 330
</td><td id='ores_chart'>18 - 293
</td><td id='ores_chart'> 
</td><td id='ores_chart'>47 - 289
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>866 - 926
</td><td id='ores_chart'> 
</td><td id='ores_chart'>19 - 245
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>598 - 663
</td><td id='ores_chart'>471 - 566
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 8   -->
 <tr id="ores_chart"><td id="ores_chart">Alioth Moon 1
</td><td id='ores_chart'>76 - 126
</td><td id='ores_chart'>71 - 129
</td><td id='ores_chart'> 
</td><td id='ores_chart'>64 - 122
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>58 - 106
</td><td id='ores_chart'>840 - 840
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 9   -->
 <tr id="ores_chart"><td id="ores_chart">Alioth Moon 4
</td><td id='ores_chart'>75 - 129
</td><td id='ores_chart'>59 - 130
</td><td id='ores_chart'> 
</td><td id='ores_chart'>41 - 131
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>28 - 119
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>836 - 836
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 10   -->
 <tr id="ores_chart"><td id="ores_chart">Feli
</td><td id='ores_chart'>83 - 161
</td><td id='ores_chart'>72 - 235
</td><td id='ores_chart'> 
</td><td id='ores_chart'>49 - 192
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>81 - 258
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>638 - 709
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>410 - 519
</td><td id='ores_chart'>794 - 3059
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 11   -->
 <tr id="ores_chart"><td id="ores_chart">Feli Moon 1
</td><td id='ores_chart'>75 - 123
</td><td id='ores_chart'>60 - 144
</td><td id='ores_chart'> 
</td><td id='ores_chart'>72 - 114
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>46 - 113
</td><td id='ores_chart'>797 - 797
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>209 - 275
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>449 - 529
</td></tr> 
<!-- row 12   -->
 <tr id="ores_chart"><td id="ores_chart">Ion
</td><td id='ores_chart'>277 - 872
</td><td id='ores_chart'>116 - 922
</td><td id='ores_chart'> 
</td><td id='ores_chart'>82 - 889
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1690 - 1750
</td><td id='ores_chart'>1498 - 1631
</td><td id='ores_chart'> 
</td><td id='ores_chart'>107 - 968
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1263 - 1401
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1790 - 1875
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 13   -->
 <tr id="ores_chart"><td id="ores_chart">Ion Moon 1
</td><td id='ores_chart'>72 - 120
</td><td id='ores_chart'>56 - 100
</td><td id='ores_chart'>200 - 284
</td><td id='ores_chart'>66 - 107
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>47 - 99
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 14   -->
 <tr id="ores_chart"><td id="ores_chart">Ion Moon 2
</td><td id='ores_chart'>59 - 117
</td><td id='ores_chart'>52 - 123
</td><td id='ores_chart'> 
</td><td id='ores_chart'>48 - 149
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>61 - 118
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>203 - 268
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>464 - 505
</td></tr> 
<!-- row 15   -->
 <tr id="ores_chart"><td id="ores_chart">Jago
</td><td id='ores_chart'>67 - 120
</td><td id='ores_chart'>52 - 115
</td><td id='ores_chart'> 
</td><td id='ores_chart'>39 - 117
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>609 - 672
</td><td id='ores_chart'>67 - 111
</td><td id='ores_chart'>1112 - 1170
</td><td id='ores_chart'>136 - 303
</td><td id='ores_chart'>376 - 514
</td><td id='ores_chart'> 
</td><td id='ores_chart'>169 - 286
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 16   -->
 <tr id="ores_chart"><td id='ores_chart'>Lacobus
</td><td id='ores_chart'>98 - 308
</td><td id='ores_chart'>48 - 341
</td><td id='ores_chart'>432 - 534
</td><td id='ores_chart'>63 - 268
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1022 - 1074
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>107 - 242
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>901 - 977
</td><td id='ores_chart'> 
</td><td id='ores_chart'>667 - 786
</td></tr> 
<!-- row 17   -->
 <tr id="ores_chart"><td id="ores_chart">Lacobus Moon 1
</td><td id='ores_chart'>57 - 131
</td><td id='ores_chart'>53 - 120
</td><td id='ores_chart'> 
</td><td id='ores_chart'>59 - 150
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>64 - 118
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 18   -->
 <tr id="ores_chart"><td id="ores_chart">Lacobus Moon 2
</td><td id='ores_chart'>11 - 108
</td><td id='ores_chart'>53 - 119
</td><td id='ores_chart'> 
</td><td id='ores_chart'>64 - 111
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>53 - 132
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>204 - 248
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 19   -->
 <tr id="ores_chart"><td id="ores_chart">Lacobus Moon 3
</td><td id='ores_chart'>36 - 105
</td><td id='ores_chart'>39 - 92
</td><td id='ores_chart'> 
</td><td id='ores_chart'>36 - 93
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>57 - 100
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 20   -->
 <tr id="ores_chart"><td id="ores_chart">Madis
</td><td id='ores_chart'>201 - 813
</td><td id='ores_chart'>57 - 930
</td><td id='ores_chart'>982 - 1160
</td><td id='ores_chart'>77 - 936
</td><td id='ores_chart'>1200 - 1310
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>227 - 740
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 21   -->
 <tr id="ores_chart"><td id="ores_chart">Madis Moon 1
</td><td id='ores_chart'>68 - 108
</td><td id='ores_chart'>67 - 135
</td><td id='ores_chart'> 
</td><td id='ores_chart'>39 - 128
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>632 - 632
</td><td id='ores_chart'>64 - 105
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>477 - 514
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 22   -->
 <tr id="ores_chart"><td id="ores_chart">Madis Moon 2
</td><td id='ores_chart'>53 - 122
</td><td id='ores_chart'>51 - 127
</td><td id='ores_chart'> 
</td><td id='ores_chart'>44 - 115
</td><td id='ores_chart'>463 - 494
</td><td id='ores_chart'> 
</td><td id='ores_chart'>859 - 859
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>68 - 118
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>633 - 664
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 23   -->
 <tr id="ores_chart"><td id="ores_chart">Madis Moon 3
</td><td id='ores_chart'>52 - 119
</td><td id='ores_chart'>52 - 114
</td><td id='ores_chart'> 
</td><td id='ores_chart'>44 - 106
</td><td id='ores_chart'> 
</td><td id='ores_chart'>858 - 858
</td><td id='ores_chart'> 
</td><td id='ores_chart'>603 - 670
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>48 - 97
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 24   -->
 <tr id="ores_chart"><td id="ores_chart">Sicari
</td><td id='ores_chart'>122 - 338
</td><td id='ores_chart'>139 - 420
</td><td id='ores_chart'> 
</td><td id='ores_chart'>76 - 363
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1006 - 1082
</td><td id='ores_chart'>100 - 480
</td><td id='ores_chart'> 
</td><td id='ores_chart'>553 - 624
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>770 - 876
</td></tr> 
<!-- row 25   -->
 <tr id="ores_chart"><td id="ores_chart">Sinnen
</td><td id='ores_chart'>67 - 965
</td><td id='ores_chart'>213 - 663
</td><td id='ores_chart'> 
</td><td id='ores_chart'>141 - 823
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1501 - 1551
</td><td id='ores_chart'>1270 - 1334
</td><td id='ores_chart'> 
</td><td id='ores_chart'>84 - 728
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>983 - 1171
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 26   -->
 <tr id="ores_chart"><td id="ores_chart">Sinnen Moon 1
</td><td id='ores_chart'>67 - 114
</td><td id='ores_chart'>64 - 110
</td><td id='ores_chart'> 
</td><td id='ores_chart'>69 - 124
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>442 - 527
</td><td id='ores_chart'> 
</td><td id='ores_chart'>78 - 125
</td><td id='ores_chart'> 
</td><td id='ores_chart'>213 - 274
</td><td id='ores_chart'> 
</td><td id='ores_chart'>620 - 620
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>883 - 883
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 27   -->
 <tr id="ores_chart"><td id="ores_chart">Symeon
</td><td id='ores_chart'>37 - 505
</td><td id='ores_chart'>74 - 547
</td><td id='ores_chart'> 
</td><td id='ores_chart'>89 - 557
</td><td id='ores_chart'>871 - 954
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1188 - 1258
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>111 - 525
</td><td id='ores_chart'> 
</td><td id='ores_chart'>590 - 740
</td><td id='ores_chart'> 
</td><td id='ores_chart'>1071 - 1117
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 28   -->
 <tr id="ores_chart"><td id="ores_chart">Talemai
</td><td id='ores_chart'>122 - 192
</td><td id='ores_chart'>131 - 182
</td><td id='ores_chart'>424 - 551
</td><td id='ores_chart'>89 - 191
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>98 - 184
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>704 - 808
</td><td id='ores_chart'> 
</td><td id='ores_chart'>312 - 393
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 29   -->
 <tr id="ores_chart"><td id="ores_chart">Talemai Moon 1
</td><td id='ores_chart'>56 - 131
</td><td id='ores_chart'>63 - 125
</td><td id='ores_chart'>211 - 350
</td><td id='ores_chart'>50 - 114
</td><td id='ores_chart'> 
</td><td id='ores_chart'>828 - 863
</td><td id='ores_chart'> 
</td><td id='ores_chart'>612 - 676
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>72 - 122
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 30   -->
 <tr id="ores_chart"><td id="ores_chart">Talemai Moon 2
</td><td id='ores_chart'>56 - 120
</td><td id='ores_chart'>62 - 105
</td><td id='ores_chart'> 
</td><td id='ores_chart'>53 - 127
</td><td id='ores_chart'>466 - 508
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>588 - 652
</td><td id='ores_chart'>58 - 106
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 31   -->
 <tr id="ores_chart"><td id="ores_chart">Talemai Moon 3
</td><td id='ores_chart'>62 - 95
</td><td id='ores_chart'>25 - 123
</td><td id='ores_chart'> 
</td><td id='ores_chart'>56 - 138
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>846 - 846
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>65 - 139
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>225 - 300
</td><td id='ores_chart'> 
</td><td id='ores_chart'>612 - 657
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 32   -->
 <tr id="ores_chart"><td id="ores_chart">Teoma
</td><td id='ores_chart'>82 - 205
</td><td id='ores_chart'>128 - 200
</td><td id='ores_chart'>296 - 387
</td><td id='ores_chart'>67 - 243
</td><td id='ores_chart'>609 - 698
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>125 - 236
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>811 - 877
</td><td id='ores_chart'> 
</td><td id='ores_chart'>414 - 514
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 33   -->
 <tr id="ores_chart"><td id="ores_chart">Thades
</td><td id='ores_chart'>21 - 367
</td><td id='ores_chart'>88 - 433
</td><td id='ores_chart'> 
</td><td id='ores_chart'>122 - 484
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>36 - 442
</td><td id='ores_chart'> 
</td><td id='ores_chart'>519 - 655
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>801 - 880
</td></tr> 
<!-- row 34   -->
 <tr id="ores_chart"><td id="ores_chart">Thades Moon 1
</td><td id='ores_chart'>62 - 117
</td><td id='ores_chart'>42 - 117
</td><td id='ores_chart'> 
</td><td id='ores_chart'>58 - 127
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>458 - 520
</td><td id='ores_chart'> 
</td><td id='ores_chart'>44 - 114
</td><td id='ores_chart'> 
</td><td id='ores_chart'>191 - 258
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- row 35   -->
 <tr id="ores_chart"><td id="ores_chart">Thades Moon 2
</td><td id='ores_chart'>46 - 104
</td><td id='ores_chart'>44 - 144
</td><td id='ores_chart'> 
</td><td id='ores_chart'>46 - 145
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>74 - 133
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'>461 - 527
</td><td id='ores_chart'>605 - 680
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td><td id='ores_chart'> 
</td></tr> 
<!-- end rows -->
</table>
    `;

    temp_HTML_Text = temp_HTML_Text + "</div>";

    return temp_HTML_Text;
}

$('td').mouseover(function () {
    $(this).siblings().css('background-color', '#b6b87f');
    var ind = $(this).index();
    $('td:nth-child(' + (ind + 1) + ')').css('background-color', '#b6b87f');
    $(this).css('background-color','#dcdcdc')
});
$('td').mouseleave(function () {
    $(this).siblings().css('background-color', '');
    var ind = $(this).index();
    $('td:nth-child(' + (ind + 1) + ')').css('background-color', '');
    $(this).css('background-color','')
});
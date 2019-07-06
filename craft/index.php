<?php
include '../config.php';
include '../library/vars.php';
include '../library/global.php';

session_start();

// When Discord redirects the user back here, there will be a "code" and "state" parameter in the query string
if(get('code')) {

    // Exchange the auth code for a token
    $token = apiRequest($tokenURL, array(
        "grant_type" => "authorization_code",
        'client_id' => OAUTH2_CLIENT_ID,
        'client_secret' => OAUTH2_CLIENT_SECRET,
        'redirect_uri' => 'http://dual.sh',
        'code' => get('code')
    ));
    $logout_token = $token->access_token;
    $_SESSION['access_token'] = $token->access_token;


    header('Location: ' . $_SERVER['PHP_SELF']);
}

if(session('access_token')) {
    $user = apiRequest($apiURLBase);
    $guilds = apiRequest($apiURLGuilds);
    $guildmember = apiBotRequest($apiURLGuildMember, $user->id);
    $data = json_decode($guildmember);
    $blacklistfile = file_get_contents('../data/blacklist.json');
    $blacklist = json_decode($blacklistfile, false);

    $isbanned = false;

    foreach($blacklist as $banned){
        if($banned->id == $user->id) {
            $isbanned = true;
        }
    }

    $found = false;
    if($isbanned == false){
        foreach($data->roles as $field) {
            if($field == ALPHA_AUTHORIZED_ROLE_ID) {
                $found = true;
                echo <<<EOL



<!DOCTYPE html>
<HTML lang="en">
<HEAD>
	<META charset="UTF-8" />
	<TITLE>
		Dual Universe Crafting Calculator
	</TITLE>
	<link rel="stylesheet" type="text/css" href="../css/crafting.css">
</HEAD>

<BODY>
	<!-- 
			THE TODO
						error code items
				hide the error code by default
				add option to show the error code
				flag all major error codes with a background color change or something to error box to get attention
				make error code array to store history of all errors, accesable in options
				add additional options to control if errors prevent actions, like adding items past inventory size

						optional stuff
				make the input field stay the same after you click the remove button on inventory list & que list (maybe other inputs also)
				make it so the materials being listed underneath the slected item inherit class from the menu
					this would make items you cant craft apear gray in this listing. maybe add, maybe not.
				add button to start countdown so you can see each item countdown in que and finish, get added to inventory, possible inventory only mode only
				make it so BPs are added to a search array and can be searched for in the search box
				add a way to delete BPs

				add the use ores instead of pures button to local storage to save state

				I think already added but make show only craftable hide sections that are empty
				also make search box able to search and only show matching items, again hiding sections that are empty

			BUGS
				tier does not update when selecting BP
				time value seems off in the BP report function, at least for when there are more then 1 of a item in the list
				drag and drop does not work in firefox
				scroll bars do not change in firefox
				color change to red in que list is not complete, only checks if item is in que before, not if there is enough of the item in que before.
				Adding Blueprints to Que does not list all items in proper order into que

	-->


<DIV CLASS="main_Area">
	<DIV CLASS="left_Area">
		<DIV CLASS="parts_Area">
			<FORM NAME="big_List" METHOD=POST onSubmit="return false;">
			<TABLE WIDTH=100%>
			<TR><TD>
				<INPUT TYPE=TEXT list="search_List" ID="search_Box" OnKeyPress="change_Selected_Search(document.getElementById('search_Box').value,event)" />
				<DATALIST ID="search_List">
					<DIV ID="search_Options">
					</DIV>
				</DATALIST>
			</TD></TR>
			<TR>
				<TD CLASS="b">Only show craftable
				<INPUT TYPE="checkbox" ID="craftable_Checkbox" CLASS="craftable_Box" OnClick="craftable_Check()" /></TD>
			</TR>
			<TR><TD CLASS="b">
			<P OnClick="hide_Content(1, 'Parts_Hide', 'Parts_Content_Hide', 'Parts:')" ID="Parts_Hide">
				Parts:
				<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
					<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
				</SVG>
			</P>
			<DIV ID="Parts_Content_Hide">
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Functional_Parts_Hide" OnClick="hide_Content(1, 'Functional_Parts_Hide', 'Functional_Parts_Content_Hide', 'Functional Parts:')">
					Functional Parts:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Functional_Parts_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Functional_Part_1_XS"  OnClick="change_Selected('Functional_Part_1_XS')">Functional Part 1 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_1_S"  OnClick="change_Selected('Functional_Part_1_S')">Functional Part 1 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_1_M"  OnClick="change_Selected('Functional_Part_1_M')">Functional Part 1 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_1_L" OnClick="change_Selected('Functional_Part_1_L')">Functional Part 1 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_1_XL" OnClick="change_Selected('Functional_Part_1_XL')">Functional Part 1 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_2_XS" OnClick="change_Selected('Functional_Part_2_XS')">Functional Part 2 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_2_S" OnClick="change_Selected('Functional_Part_2_S')">Functional Part 2 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_2_M" OnClick="change_Selected('Functional_Part_2_M')">Functional Part 2 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_2_L" OnClick="change_Selected('Functional_Part_2_L')">Functional Part 2 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_2_XL" OnClick="change_Selected('Functional_Part_2_XL')">Functional Part 2 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_3_XS" OnClick="change_Selected('Functional_Part_3_XS')">Functional Part 3 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_3_S" OnClick="change_Selected('Functional_Part_3_S')">Functional Part 3 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_3_M" OnClick="change_Selected('Functional_Part_3_M')">Functional Part 3 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_3_L" OnClick="change_Selected('Functional_Part_3_L')">Functional Part 3 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_3_XL" OnClick="change_Selected('Functional_Part_3_XL')">Functional Part 3 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_4_XS" OnClick="change_Selected('Functional_Part_4_XS')">Functional Part 4 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_4_S" OnClick="change_Selected('Functional_Part_4_S')">Functional Part 4 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_4_M" OnClick="change_Selected('Functional_Part_4_M')">Functional Part 4 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_4_L" OnClick="change_Selected('Functional_Part_4_L')">Functional Part 4 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_4_XL" OnClick="change_Selected('Functional_Part_4_XL')">Functional Part 4 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_5_XS" OnClick="change_Selected('Functional_Part_5_XS')">Functional Part 5 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_5_S" OnClick="change_Selected('Functional_Part_5_S')">Functional Part 5 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_5_M" OnClick="change_Selected('Functional_Part_5_M')">Functional Part 5 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_5_L" OnClick="change_Selected('Functional_Part_5_L')">Functional Part 5 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Functional_Part_5_XL" OnClick="change_Selected('Functional_Part_5_XL')">Functional Part 5 XL</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Execptional_Parts_Hide" OnClick="hide_Content(1, 'Execptional_Parts_Hide', 'Execptional_Parts_Content_Hide', 'Execptional Parts:')">
					Execptional Parts:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Execptional_Parts_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Execptional_Part_3" OnClick="change_Selected('Execptional_Part_3')">Execptional Part 3</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Execptional_Part_4" OnClick="change_Selected('Execptional_Part_4')">Execptional Part 4</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Execptional_Part_5" OnClick="change_Selected('Execptional_Part_5')">Execptional Part 5</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Complex_Parts_Hide" OnClick="hide_Content(1, 'Complex_Parts_Hide', 'Complex_Parts_Content_Hide', 'Complex Parts:')">
					Complex Parts:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Complex_Parts_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Complex_Part_1" OnClick="change_Selected('Complex_Part_1')">Complex Part 1</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Complex_Part_2" OnClick="change_Selected('Complex_Part_2')">Complex Part 2</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Complex_Part_3" OnClick="change_Selected('Complex_Part_3')">Complex Part 3</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Complex_Part_4" OnClick="change_Selected('Complex_Part_4')">Complex Part 4</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Complex_Part_5" OnClick="change_Selected('Complex_Part_5')">Complex Part 5</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Structural_Parts_Hide" OnClick="hide_Content(1, 'Structural_Parts_Hide', 'Structural_Parts_Content_Hide', 'Structural Parts:')">
					Structural Parts:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Structural_Parts_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Structural_Part_1_XS" OnClick="change_Selected('Structural_Part_1_XS')">Structural Part 1 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_1_S" OnClick="change_Selected('Structural_Part_1_S')">Structural Part 1 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_1_M" OnClick="change_Selected('Structural_Part_1_M')">Structural Part 1 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_1_L" OnClick="change_Selected('Structural_Part_1_L')">Structural Part 1 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_1_XL" OnClick="change_Selected('Structural_Part_1_XL')">Structural Part 1 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_2_XS" OnClick="change_Selected('Structural_Part_2_XS')">Structural Part 2 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_2_S" OnClick="change_Selected('Structural_Part_2_S')">Structural Part 2 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_2_M" OnClick="change_Selected('Structural_Part_2_M')">Structural Part 2 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_2_L" OnClick="change_Selected('Structural_Part_2_L')">Structural Part 2 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_2_XL" OnClick="change_Selected('Structural_Part_2_XL')">Structural Part 2 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_3_XS" OnClick="change_Selected('Structural_Part_3_XS')">Structural Part 3 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_3_S" OnClick="change_Selected('Structural_Part_3_S')">Structural Part 3 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_3_M" OnClick="change_Selected('Structural_Part_3_M')">Structural Part 3 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_3_L" OnClick="change_Selected('Structural_Part_3_L')">Structural Part 3 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_3_XL" OnClick="change_Selected('Structural_Part_3_XL')">Structural Part 3 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_4_XS" OnClick="change_Selected('Structural_Part_4_XS')">Structural Part 4 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_4_S" OnClick="change_Selected('Structural_Part_4_S')">Structural Part 4 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_4_M" OnClick="change_Selected('Structural_Part_4_M')">Structural Part 4 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_4_L" OnClick="change_Selected('Structural_Part_4_L')">Structural Part 4 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_4_XL" OnClick="change_Selected('Structural_Part_4_XL')">Structural Part 4 XL</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_5_XS" OnClick="change_Selected('Structural_Part_5_XS')">Structural Part 5 XS</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_5_S" OnClick="change_Selected('Structural_Part_5_S')">Structural Part 5 S</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_5_M" OnClick="change_Selected('Structural_Part_5_M')">Structural Part 5 M</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_5_L" OnClick="change_Selected('Structural_Part_5_L')">Structural Part 5 L</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Structural_Part_5_XL" OnClick="change_Selected('Structural_Part_5_XL')">Structural Part 5 XL</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Intermediary_Parts_Hide" OnClick="hide_Content(1, 'Intermediary_Parts_Hide', 'Intermediary_Parts_Content_Hide', 'Intermediary Parts:')">
					Intermediary Parts:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Intermediary_Parts_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Intermediary_Part_1" OnClick="change_Selected('Intermediary_Part_1')">Intermediary Part 1</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Intermediary_Part_2" OnClick="change_Selected('Intermediary_Part_2')">Intermediary Part 2</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Intermediary_Part_3" OnClick="change_Selected('Intermediary_Part_3')">Intermediary Part 3</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
			</DIV>
			</TD></TR>
			<TR><TD CLASS="b">
			<P OnClick="hide_Content(1, 'Consumables_Hide', 'Consumables_Content_Hide', 'Consumables:')" ID="Consumables_Hide">
				Consumables:
				<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
					<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
				</SVG>
			</P>
			<DIV ID="Consumables_Content_Hide">
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Elements_Hide" OnClick="hide_Content(1, 'Elements_Hide', 'Elements_Content_Hide', 'Elements:')">
					Elements:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Elements_Content_Hide">
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Planet_Elements_Hide" OnClick="hide_Content(1, 'Planet_Elements_Hide', 'Planet_Elements_Content_Hide', 'Planet Elements:')">
						Planet Elements:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Planet_Elements_Content_Hide">
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Core_Units_Hide" OnClick="hide_Content(1, 'Core_Units_Hide', 'Core_Units_Content_Hide', 'Core Units:')">
							Core Units:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Core_Units_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Dynamic_Core_Units_Hide" OnClick="hide_Content(1, 'Dynamic_Core_Units_Hide', 'Dynamic_Core_Units_Content_Hide', 'Dynamic Core Units:')">
								Dynamic Core Units:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Dynamic_Core_Units_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Dynamic_Core_XS" OnClick="change_Selected('Dynamic_Core_XS')">Dynamic Core XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Dynamic_Core_S" OnClick="change_Selected('Dynamic_Core_S')">Dynamic Core S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Dynamic_Core_M" OnClick="change_Selected('Dynamic_Core_M')">Dynamic Core M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Dynamic_Core_L" OnClick="change_Selected('Dynamic_Core_L')">Dynamic Core L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Static_Core_Units_Hide" OnClick="hide_Content(1, 'Static_Core_Units_Hide', 'Static_Core_Units_Content_Hide', 'Static Core Units:')">
								Static Core Units:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Static_Core_Units_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Static_Core_XS" OnClick="change_Selected('Static_Core_XS')">Static Core XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Static_Core_S" OnClick="change_Selected('Static_Core_S')">Static Core S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Static_Core_M" OnClick="change_Selected('Static_Core_M')">Static Core M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Static_Core_L" OnClick="change_Selected('Static_Core_L')">Static Core L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Ground_Lights_Hide" OnClick="hide_Content(1, 'Ground_Lights_Hide', 'Ground_Lights_Content_Hide', 'Ground Lights:')">
							Ground Lights:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Ground_Lights_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Deployable_Light_Orb" OnClick="change_Selected('Deployable_Light_Orb')">Deployable Light Orb</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
					</DIV>
					</TD></TR></TABLE>
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Construct_Elements_Hide" OnClick="hide_Content(1, 'Construct_Elements_Hide', 'Construct_Elements_Content_Hide', 'Construct Elements:')">
						Construct Elements:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Construct_Elements_Content_Hide">
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Resurrection_Nodes_Hide" OnClick="hide_Content(1, 'Resurrection_Nodes_Hide', 'Resurrection_Nodes_Content_Hide', 'Resurrection Nodes:')">
							Resurrection Nodes:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Resurrection_Nodes_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Resurrection_Node" OnClick="change_Selected('Resurrection_Node')">Resurrection Node</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Containers_Hide" OnClick="hide_Content(1, 'Containers_Hide', 'Containers_Content_Hide', 'Containers:')">
							Containers:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Containers_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Item_Containers_Hide" OnClick="hide_Content(1, 'Item_Containers_Hide', 'Item_Containers_Content_Hide', 'Item Containers:')">
								Item Containers:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Item_Containers_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Container_Hub" OnClick="change_Selected('Container_Hub')">Container Hub</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Container_XS" OnClick="change_Selected('Container_XS')">Container XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Container_S" OnClick="change_Selected('Container_S')">Container S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Container_M" OnClick="change_Selected('Container_M')">Container M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Container_L" OnClick="change_Selected('Container_L')">Container L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Fuel_Tanks_Hide" OnClick="hide_Content(1, 'Fuel_Tanks_Hide', 'Fuel_Tanks_Content_Hide', 'Fuel Tanks:')">
								Fuel Tanks:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Fuel_Tanks_Content_Hide">
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Rocket_Fuel_Containers_Hide" OnClick="hide_Content(1, 'Rocket_Fuel_Containers_Hide', 'Rocket_Fuel_Containers_Content_Hide', 'Rocket Fuel Containers:')">
									Rocket Fuel Containers:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Rocket_Fuel_Containers_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Rocket_Tank_XS" OnClick="change_Selected('Rocket_Tank_XS')">Rocket Tank XS</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Rocket_Tank_S" OnClick="change_Selected('Rocket_Tank_S')">Rocket Tank S</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Rocket_Tank_M" OnClick="change_Selected('Rocket_Tank_M')">Rocket Tank M</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Rocket_Tank_L" OnClick="change_Selected('Rocket_Tank_L')">Rocket Tank L</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Atmospheric_Fuel_Containers_Hide" OnClick="hide_Content(1, 'Atmospheric_Fuel_Containers_Hide', 'Atmospheric_Fuel_Containers_Content_Hide', 'Atmospheric Fuel Containers:')">
									Atmospheric Fuel Containers:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Atmospheric_Fuel_Containers_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Atmospheric_Tank_XS" OnClick="change_Selected('Atmospheric_Tank_XS')">Atmospheric Tank XS</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Atmospheric_Tank_S" OnClick="change_Selected('Atmospheric_Tank_S')">Atmospheric Tank S</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Atmospheric_Tank_M" OnClick="change_Selected('Atmospheric_Tank_M')">Atmospheric Tank M</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Atmospheric_Tank_L" OnClick="change_Selected('Atmospheric_Tank_L')">Atmospheric Tank L</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Space_Fuel_Containers_Hide" OnClick="hide_Content(1, 'Space_Fuel_Containers_Hide', 'Space_Fuel_Containers_Content_Hide', 'Space Fuel Containers:')">
									Space Fuel Containers:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Space_Fuel_Containers_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Space_Tank_S" OnClick="change_Selected('Space_Tank_S')">Space Tank S</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Space_Tank_M" OnClick="change_Selected('Space_Tank_M')">Space Tank M</TD>
									</TR>
									<TR>
										<TD CLASS="b" ID="Space_Tank_L" OnClick="change_Selected('Space_Tank_L')">Space Tank L</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Dispensers_Hide" OnClick="hide_Content(1, 'Dispensers_Hide', 'Dispensers_Content_Hide', 'Dispensers:')">
								Dispensers:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Dispensers_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Dispenser" OnClick="change_Selected('Dispenser')">Dispenser</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Interactive_Elements_Hide" OnClick="hide_Content(1, 'Interactive_Elements_Hide', 'Interactive_Elements_Content_Hide', 'Interactive Elements:')">
							Interactive Elements:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Interactive_Elements_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Landing_Gears_Hide" OnClick="hide_Content(1, 'Landing_Gears_Hide', 'Landing_Gears_Content_Hide', 'Landing Gears:')">
								Landing Gears:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Landing_Gears_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Landing_Gear_XS" OnClick="change_Selected('Landing_Gear_XS')">Landing Gear XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Landing_Gear_S" OnClick="change_Selected('Landing_Gear_S')">Landing Gear S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Landing_Gear_M" OnClick="change_Selected('Landing_Gear_M')">Landing Gear M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Landing_Gear_L" OnClick="change_Selected('Landing_Gear_L')">Landing Gear L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Force_Fields_Hide" OnClick="hide_Content(1, 'Force_Fields_Hide', 'Force_Fields_Content_Hide', 'Force Fields:')">
								Force Fields:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Force_Fields_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Force_Field_XS" OnClick="change_Selected('Force_Field_XS')">Force Field XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Force_Field_S" OnClick="change_Selected('Force_Field_S')">Force Field S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Force_Field_M" OnClick="change_Selected('Force_Field_M')">Force Field M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Force_Field_L" OnClick="change_Selected('Force_Field_L')">Force Field L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Interactive_Elements_Elevators_Hide" OnClick="hide_Content(1, 'Interactive_Elements_Elevators_Hide', 'Interactive_Elements_Elevators_Content_Hide', 'Interactive Elements Elevators:')">
								Interactive Elements Elevators:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Interactive_Elements_Elevators_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Elevator_XS" OnClick="change_Selected('Elevator_XS')">Elevator XS</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Doors_Hide" OnClick="hide_Content(1, 'Doors_Hide', 'Doors_Content_Hide', 'Doors:')">
								Doors:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Doors_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Sliding_Door_S" OnClick="change_Selected('Sliding_Door_S')">Sliding Door S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Sliding_Door_M" OnClick="change_Selected('Sliding_Door_M')">Sliding Door M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Expanded_Gate_S" OnClick="change_Selected('Expanded_Gate_S')">Expanded Gate S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Expanded_Gate_L" OnClick="change_Selected('Expanded_Gate_L')">Expanded Gate L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Gate_XS" OnClick="change_Selected('Gate_XS')">Gate XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Gate_M" OnClick="change_Selected('Gate_M')">Gate M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Gate_XL" OnClick="change_Selected('Gate_XL')">Gate XL</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Reinforced_Sliding_Door" OnClick="change_Selected('Reinforced_Sliding_Door')">Reinforced Sliding Door</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Interior_Door" OnClick="change_Selected('Interior_Door')">Interior Door</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Airlock" OnClick="change_Selected('Airlock')">Airlock</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Screens_Hide" OnClick="hide_Content(1, 'Screens_Hide', 'Screens_Content_Hide', 'Screens:')">
								Screens:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Screens_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD>
									<TABLE WIDTH=100%>
									<TR><TD CLASS="b">
									<P ID="Signs_Hide" OnClick="hide_Content(1, 'Signs_Hide', 'Signs_Content_Hide', 'Signs:')">
										Signs:
										<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
											<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
											<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
										</SVG>
									</P>
									<DIV ID="Signs_Content_Hide">
										<TABLE WIDTH=100%>
										<TR>
											<TD CLASS="b" ID="Sign_XS" OnClick="change_Selected('Sign_XS')">Sign XS</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_S" OnClick="change_Selected('Sign_S')">Sign S</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_M" OnClick="change_Selected('Sign_M')">Sign M</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_L" OnClick="change_Selected('Sign_L')">Sign L</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_Vertical_XS" OnClick="change_Selected('Sign_Vertical_XS')">Sign Vertical XS</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_Vertical_M" OnClick="change_Selected('Sign_Vertical_M')">Sign Vertical M</TD>
										</TR>
										<TR>
											<TD CLASS="b" ID="Sign_Vertical_L" OnClick="change_Selected('Sign_Vertical_L')">Sign Vertical L</TD>
										</TR>
										</TABLE>
									</DIV>
									</TD></TR></TABLE>
									</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Screen_XS" OnClick="change_Selected('Screen_XS')">Screen XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Screen_S" OnClick="change_Selected('Screen_S')">Screen S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Screen_M" OnClick="change_Selected('Screen_M')">Screen M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Screen_XL" OnClick="change_Selected('Screen_XL')">Screen XL</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Transparant_Screen_XS" OnClick="change_Selected('Transparant_Screen_XS')">Transparant Screen XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Transparant_Screen_S" OnClick="change_Selected('Transparant_Screen_S')">Transparant Screen S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Transparant_Screen_M" OnClick="change_Selected('Transparant_Screen_M')">Transparant Screen M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Transparant_Screen_L" OnClick="change_Selected('Transparant_Screen_L')">Transparant Screen L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Seats_Hide" OnClick="hide_Content(1, 'Seats_Hide', 'Seats_Content_Hide', 'Seats:')">
							Seats:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Seats_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Office_Chair" OnClick="change_Selected('Office_Chair')">Office Chair</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Navigator_Chair" OnClick="change_Selected('Navigator_Chair')">Navigator Chair</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Encampment_Chair" OnClick="change_Selected('Encampment_Chair')">Encampment Chair</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Stabilizers_Hide" OnClick="hide_Content(1, 'Stabilizers_Hide', 'Stabilizers_Content_Hide', 'Stabilizers:')">
							Stabilizers:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Stabilizers_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Stabilizer_S" OnClick="change_Selected('Stabilizer_S')">Stabilizer S</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Stabilizer_M" OnClick="change_Selected('Stabilizer_M')">Stabilizer M</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Stabilizer_L" OnClick="change_Selected('Stabilizer_L')">Stabilizer L</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Engines_Hide" OnClick="hide_Content(1, 'Engines_Hide', 'Engines_Content_Hide', 'Engines:')">
							Engines:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Engines_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Space_Brakes_Hide" OnClick="hide_Content(1, 'Space_Brakes_Hide', 'Space_Brakes_Content_Hide', 'Space Brakes:')">
								Space Brakes:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Space_Brakes_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Retro_Rocket_Brake_S" OnClick="change_Selected('Retro_Rocket_Brake_S')">Retro Rocket Brake S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Retro_Rocket_Brake_M" OnClick="change_Selected('Retro_Rocket_Brake_M')">Retro Rocket Brake M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Retro_Rocket_Brake_L" OnClick="change_Selected('Retro_Rocket_Brake_L')">Retro Rocket Brake L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Air_Brakes_Hide" OnClick="hide_Content(1, 'Air_Brakes_Hide', 'Air_Brakes_Content_Hide', 'Air Brakes:')">
								Air Brakes:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Air_Brakes_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Airbrake_S" OnClick="change_Selected('Atmospheric_Airbrake_S')">Atmospheric Airbrake S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Airbrake_M" OnClick="change_Selected('Atmospheric_Airbrake_M')">Atmospheric Airbrake M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Airbrake_L" OnClick="change_Selected('Atmospheric_Airbrake_L')">Atmospheric Airbrake L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Ailerons_Hide" OnClick="hide_Content(1, 'Ailerons_Hide', 'Ailerons_Content_Hide', 'Ailerons:')">
								Ailerons:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Ailerons_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Compact_Aileron_S" OnClick="change_Selected('Compact_Aileron_S')">Compact Aileron S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Compact_Aileron_M" OnClick="change_Selected('Compact_Aileron_M')">Compact Aileron M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Compact_Aileron_L" OnClick="change_Selected('Compact_Aileron_L')">Compact Aileron L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Aileron_S" OnClick="change_Selected('Aileron_S')">Aileron S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Aileron_M" OnClick="change_Selected('Aileron_M')">Aileron M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Aileron_L" OnClick="change_Selected('Aileron_L')">Aileron L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Atmospheric_Engines_Hide" OnClick="hide_Content(1, 'Atmospheric_Engines_Hide', 'Atmospheric_Engines_Content_Hide', 'Atmospheric Engines:')">
								Atmospheric Engines:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Atmospheric_Engines_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Engine_XS" OnClick="change_Selected('Atmospheric_Engine_XS')">Atmospheric Engine XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Engine_S" OnClick="change_Selected('Atmospheric_Engine_S')">Atmospheric Engine S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Engine_M" OnClick="change_Selected('Atmospheric_Engine_M')">Atmospheric Engine M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Atmospheric_Engine_L" OnClick="change_Selected('Atmospheric_Engine_L')">Atmospheric Engine L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Space_Engines_Hide" OnClick="hide_Content(1, 'Space_Engines_Hide', 'Space_Engines_Content_Hide', 'Space Engines:')">
								Space Engines:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Space_Engines_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Space_Engine_XS" OnClick="change_Selected('Space_Engine_XS')">Space Engine XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Space_Engine_S" OnClick="change_Selected('Space_Engine_S')">Space Engine S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Space_Engine_M" OnClick="change_Selected('Space_Engine_M')">Space Engine M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Space_Engine_L" OnClick="change_Selected('Space_Engine_L')">Space Engine L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Space_Engine_XL" OnClick="change_Selected('Space_Engine_XL')">Space Engine XL</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Hovercraft_Engines_Hide" OnClick="hide_Content(1, 'Hovercraft_Engines_Hide', 'Hovercraft_Engines_Content_Hide', 'Hovercraft Engines:')">
								Hovercraft Engines:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Hovercraft_Engines_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Hover_Engine_S" OnClick="change_Selected('Hover_Engine_S')">Hover Engine S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Hover_Engine_M" OnClick="change_Selected('Hover_Engine_M')">Hover Engine M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Hover_Engine_L" OnClick="change_Selected('Hover_Engine_L')">Hover Engine L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Flat_Hover_Engine_L" OnClick="change_Selected('Flat_Hover_Engine_L')">Flat Hover Engine L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Adjustors_Hide" OnClick="hide_Content(1, 'Adjustors_Hide', 'Adjustors_Content_Hide', 'Adjustors:')">
								Adjustors:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Adjustors_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Adjustor_XS" OnClick="change_Selected('Adjustor_XS')">Adjustor XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Adjustor_S" OnClick="change_Selected('Adjustor_S')">Adjustor S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Adjustor_M" OnClick="change_Selected('Adjustor_M')">Adjustor M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Adjustor_L" OnClick="change_Selected('Adjustor_L')">Adjustor L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Rocket_Engines_Hide" OnClick="hide_Content(1, 'Rocket_Engines_Hide', 'Rocket_Engines_Content_Hide', 'Rocket Engines:')">
								Rocket Engines:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Rocket_Engines_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Rocket_Engine_S" OnClick="change_Selected('Rocket_Engine_S')">Rocket Engine S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Rocket_Engine_M" OnClick="change_Selected('Rocket_Engine_M')">Rocket Engine M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Rocket_Engine_L" OnClick="change_Selected('Rocket_Engine_L')">Rocket Engine L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Vertical_Boosters_Hide" OnClick="hide_Content(1, 'Vertical_Boosters_Hide', 'Vertical_Boosters_Content_Hide', 'Vertical Boosters:')">
								Vertical Boosters:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Vertical_Boosters_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Vertical_Booster_XS" OnClick="change_Selected('Vertical_Booster_XS')">Vertical Booster XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Vertical_Booster_S" OnClick="change_Selected('Vertical_Booster_S')">Vertical Booster S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Vertical_Booster_M" OnClick="change_Selected('Vertical_Booster_M')">Vertical Booster M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Vertical_Booster_L" OnClick="change_Selected('Vertical_Booster_L')">Vertical Booster L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Instruments_Hide" OnClick="hide_Content(1, 'Instruments_Hide', 'Instruments_Content_Hide', 'Instruments:')">
							Instruments:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Instruments_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Territory_Scanners_Hide" OnClick="hide_Content(1, 'Territory_Scanners_Hide', 'Territory_Scanners_Content_Hide', 'Territory Scanners:')">
								Territory Scanners:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Territory_Scanners_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Territory_Scanner" OnClick="change_Selected('Territory_Scanner')">Territory Scanner</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Gyroscopes_Hide" OnClick="hide_Content(1, 'Gyroscopes_Hide', 'Gyroscopes_Content_Hide', 'Gyroscopes:')">
								Gyroscopes:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Gyroscopes_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Gyroscope" OnClick="change_Selected('Gyroscope')">Gyroscope</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Telemeters_Hide" OnClick="hide_Content(1, 'Telemeters_Hide', 'Telemeters_Content_Hide', 'Telemeters:')">
								Telemeters:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Telemeters_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Telemeter" OnClick="change_Selected('Telemeter')">Telemeter</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Lights_Hide" OnClick="hide_Content(1, 'Lights_Hide', 'Lights_Content_Hide', 'Lights:')">
							Lights:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Lights_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Long_Light_XS" OnClick="change_Selected('Long_Light_XS')">Long Light XS</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Long_Light_S" OnClick="change_Selected('Long_Light_S')">Long Light S</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Long_Light_M_M" OnClick="change_Selected('Long_Light_M_M')">Long Light M M</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Long_Light_L_L" OnClick="change_Selected('Long_Light_L_L')">Long Light L L</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Square_Light_XS" OnClick="change_Selected('Square_Light_XS')">Square Light XS</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Square_Light_S" OnClick="change_Selected('Square_Light_S')">Square Light S</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Square_Light_M" OnClick="change_Selected('Square_Light_M')">Square Light M</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Square_Light_L" OnClick="change_Selected('Square_Light_L')">Square Light L</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Headlight" OnClick="change_Selected('Headlight')">Headlight</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Vertical_Light_XS" OnClick="change_Selected('Vertical_Light_XS')">Vertical Light XS</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Vertical_Light_S" OnClick="change_Selected('Vertical_Light_S')">Vertical Light S</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Vertical_Light_L" OnClick="change_Selected('Vertical_Light_L')">Vertical Light L</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Vertical_Light_M_M" OnClick="change_Selected('Vertical_Light_M_M')">Vertical Light M M</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="AntiGravity_Pulsors_Hide" OnClick="hide_Content(1, 'AntiGravity_Pulsors_Hide', 'AntiGravity_Pulsors_Content_Hide', 'AntiGravity Pulsors:')">
							AntiGravity Pulsors:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="AntiGravity_Pulsors_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="AntiGravity_Pulsor" OnClick="change_Selected('AntiGravity_Pulsor')">AntiGravity Pulsor</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Electronics_Hide" OnClick="hide_Content(1, 'Electronics_Hide', 'Electronics_Content_Hide', 'Electronics:')">
							Electronics:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Electronics_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="AND_Operators_Hide" OnClick="hide_Content(1, 'AND_Operators_Hide', 'AND_Operators_Content_Hide', 'AND Operators:')">
								AND Operators:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="AND_Operators_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="AND_Operator" OnClick="change_Selected('AND_Operator')">AND Operator</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Receivers_Hide" OnClick="hide_Content(1, 'Receivers_Hide', 'Receivers_Content_Hide', 'Receivers:')">
								Receivers:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Receivers_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Receiver_XS" OnClick="change_Selected('Receiver_XS')">Receiver XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Receiver_S" OnClick="change_Selected('Receiver_S')">Receiver S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Receiver_M" OnClick="change_Selected('Receiver_M')">Receiver M</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="OR_Operators_Hide" OnClick="hide_Content(1, 'OR_Operators_Hide', 'OR_Operators_Content_Hide', 'OR Operators:')">
								OR Operators:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="OR_Operators_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="OR_Operator" OnClick="change_Selected('OR_Operator')">OR Operator</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Relays_Hide" OnClick="hide_Content(1, 'Relays_Hide', 'Relays_Content_Hide', 'Relays:')">
								Relays:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Relays_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Relay" OnClick="change_Selected('Relay')">Relay</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Data_Banks_Hide" OnClick="hide_Content(1, 'Data_Banks_Hide', 'Data_Banks_Content_Hide', 'Data Banks:')">
								Data Banks:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Data_Banks_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Databank" OnClick="change_Selected('Databank')">Databank</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Laser_Emitters_Hide" OnClick="hide_Content(1, 'Laser_Emitters_Hide', 'Laser_Emitters_Content_Hide', 'Laser Emitters:')">
								Laser Emitters:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Laser_Emitters_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Infra_Red_Laser_Emitter" OnClick="change_Selected('Infra_Red_Laser_Emitter')">Infra Red Laser Emitter</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Laser_Emitter" OnClick="change_Selected('Laser_Emitter')">Laser Emitter</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Counters_Hide" OnClick="hide_Content(1, 'Counters_Hide', 'Counters_Content_Hide', 'Counters:')">
								Counters:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Counters_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Counter_2" OnClick="change_Selected('Counter_2')">Counter 2</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Counter_3" OnClick="change_Selected('Counter_3')">Counter 3</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Counter_5" OnClick="change_Selected('Counter_5')">Counter 5</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Counter_7" OnClick="change_Selected('Counter_7')">Counter 7</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Counter_10" OnClick="change_Selected('Counter_10')">Counter 10</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Delay_Lines_Hide" OnClick="hide_Content(1, 'Delay_Lines_Hide', 'Delay_Lines_Content_Hide', 'Delay Lines:')">
								Delay Lines:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Delay_Lines_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Delay_Line" OnClick="change_Selected('Delay_Line')">Delay Line</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Data_Emitters_Hide" OnClick="hide_Content(1, 'Data_Emitters_Hide', 'Data_Emitters_Content_Hide', 'Data Emitters:')">
								Data Emitters:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Data_Emitters_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Emitter_XS" OnClick="change_Selected('Emitter_XS')">Emitter XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Emitter_S" OnClick="change_Selected('Emitter_S')">Emitter S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Emitter_M" OnClick="change_Selected('Emitter_M')">Emitter M</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="NOT_Operators_Hide" OnClick="hide_Content(1, 'NOT_Operators_Hide', 'NOT_Operators_Content_Hide', 'NOT Operators:')">
								NOT Operators:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="NOT_Operators_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="NOT_Operator" OnClick="change_Selected('NOT_Operator')">NOT Operator</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Sensors_Hide" OnClick="hide_Content(1, 'Sensors_Hide', 'Sensors_Content_Hide', 'Sensors:')">
							Sensors:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Sensors_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Radars_Hide" OnClick="hide_Content(1, 'Radars_Hide', 'Radars_Content_Hide', 'Radars:')">
								Radars:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Radars_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Radar_S" OnClick="change_Selected('Radar_S')">Radar S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Radar_M" OnClick="change_Selected('Radar_M')">Radar M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Radar_L" OnClick="change_Selected('Radar_L')">Radar L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Manual_Switches_Hide" OnClick="hide_Content(1, 'Manual_Switches_Hide', 'Manual_Switches_Content_Hide', 'Manual Switches:')">
								Manual Switches:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Manual_Switches_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Manual_Switch" OnClick="change_Selected('Manual_Switch')">Manual Switch</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Pressure_Tiles_Hide" OnClick="hide_Content(1, 'Pressure_Tiles_Hide', 'Pressure_Tiles_Content_Hide', 'Pressure Tiles:')">
								Pressure Tiles:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Pressure_Tiles_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Pressure_Tile" OnClick="change_Selected('Pressure_Tile')">Pressure Tile</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Manual_Buttons_Hide" OnClick="hide_Content(1, 'Manual_Buttons_Hide', 'Manual_Buttons_Content_Hide', 'Manual Buttons:')">
								Manual Buttons:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Manual_Buttons_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Manual_Button_XS" OnClick="change_Selected('Manual_Button_XS')">Manual Button XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Manual_Button_S" OnClick="change_Selected('Manual_Button_S')">Manual Button S</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Laser_Detectors_Hide" OnClick="hide_Content(1, 'Laser_Detectors_Hide', 'Laser_Detectors_Content_Hide', 'Laser Detectors:')">
								Laser Detectors:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Laser_Detectors_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Laser_Receiver" OnClick="change_Selected('Laser_Receiver')">Laser Receiver</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Infra_Red_Laser_Receiver" OnClick="change_Selected('Infra_Red_Laser_Receiver')">Infra Red Laser Receiver</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Zone_Detectors_Hide" OnClick="hide_Content(1, 'Zone_Detectors_Hide', 'Zone_Detectors_Content_Hide', 'Zone Detectors:')">
								Zone Detectors:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Zone_Detectors_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Detection_Zone_XS" OnClick="change_Selected('Detection_Zone_XS')">Detection Zone XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Detection_Zone_S" OnClick="change_Selected('Detection_Zone_S')">Detection Zone S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Detection_Zone_M" OnClick="change_Selected('Detection_Zone_M')">Detection Zone M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Detection_Zone_L" OnClick="change_Selected('Detection_Zone_L')">Detection Zone L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Anti_Gravity_Generator_Hide" OnClick="hide_Content(1, 'Anti_Gravity_Generator_Hide', 'Anti_Gravity_Generator_Content_Hide', 'Anti Gravity Generator:')">
							Anti Gravity Generator:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Anti_Gravity_Generator_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Anti_Gravity_Generator_S" OnClick="change_Selected('Anti_Gravity_Generator_S')">Anti Gravity Generator S</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Anti_Gravity_Generator_M" OnClick="change_Selected('Anti_Gravity_Generator_M')">Anti Gravity Generator M</TD>
							</TR>
							<TR>
								<TD CLASS="b" ID="Anti_Gravity_Generator_L" OnClick="change_Selected('Anti_Gravity_Generator_L')">Anti Gravity Generator L</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Decorative_Element_Hide" OnClick="hide_Content(1, 'Decorative_Element_Hide', 'Decorative_Element_Content_Hide', 'Decorative Element:')">
							Decorative Element:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Decorative_Element_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Hull_Decoration_Hide" OnClick="hide_Content(1, 'Hull_Decoration_Hide', 'Hull_Decoration_Content_Hide', 'Hull Decoration:')">
								Hull Decoration:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Hull_Decoration_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Steel_Column" OnClick="change_Selected('Steel_Column')">Steel Column</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Steel_Panel" OnClick="change_Selected('Steel_Panel')">Steel Panel</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Hull_Decorative_Element_A" OnClick="change_Selected('Hull_Decorative_Element_A')">Hull Decorative Element A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Hull_Decorative_Element_B" OnClick="change_Selected('Hull_Decorative_Element_B')">Hull Decorative Element B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Hull_Decorative_Element_C" OnClick="change_Selected('Hull_Decorative_Element_C')">Hull Decorative Element C</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Barriers_Hide" OnClick="hide_Content(1, 'Barriers_Hide', 'Barriers_Content_Hide', 'Barriers:')">
								Barriers:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Barriers_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Barrier_Corner" OnClick="change_Selected('Barrier_Corner')">Barrier Corner</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Barrier_S" OnClick="change_Selected('Barrier_S')">Barrier S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Barrier_M" OnClick="change_Selected('Barrier_M')">Barrier M</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Adjuncts_Hide" OnClick="hide_Content(1, 'Adjuncts_Hide', 'Adjuncts_Content_Hide', 'Adjuncts:')">
								Adjuncts:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Adjuncts_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Wing_XS" OnClick="change_Selected('Wing_XS')">Wing XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_S" OnClick="change_Selected('Wing_S')">Wing S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_M" OnClick="change_Selected('Wing_M')">Wing M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_L" OnClick="change_Selected('Wing_L')">Wing L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_Tip_S" OnClick="change_Selected('Wing_Tip_S')">Wing Tip S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_Tip_M" OnClick="change_Selected('Wing_Tip_M')">Wing Tip M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wing_Tip_L" OnClick="change_Selected('Wing_Tip_L')">Wing Tip L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Vertical_Wing" OnClick="change_Selected('Vertical_Wing')">Vertical Wing</TD>
								</TR>
								</TABLE>
							</DIV>
							<TR>
								<TD CLASS="b" ID="Keyboard_Unit" OnClick="change_Selected('Keyboard_Unit')">Keyboard Unit</TD>
							</TR>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Holograms_Hide" OnClick="hide_Content(1, 'Holograms_Hide', 'Holograms_Content_Hide', 'Holograms:')">
								Holograms:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Holograms_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Spaceship_Hologram_S" OnClick="change_Selected('Spaceship_Hologram_S')">Spaceship Hologram S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Spaceship_Hologram_M" OnClick="change_Selected('Spaceship_Hologram_M')">Spaceship Hologram M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Spaceship_Hologram_L" OnClick="change_Selected('Spaceship_Hologram_L')">Spaceship Hologram L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Planet_Hologram" OnClick="change_Selected('Planet_Hologram')">Planet Hologram</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Planet_Hologram_L" OnClick="change_Selected('Planet_Hologram_L')">Planet Hologram L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Windows_Hide" OnClick="hide_Content(1, 'Windows_Hide', 'Windows_Content_Hide', 'Windows:')">
								Windows:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Windows_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Window_XS" OnClick="change_Selected('Window_XS')">Window XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Window_S" OnClick="change_Selected('Window_S')">Window S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Window_M" OnClick="change_Selected('Window_M')">Window M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Window_L" OnClick="change_Selected('Window_L')">Window L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Armored_Window_XS" OnClick="change_Selected('Armored_Window_XS')">Armored Window XS</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Armored_Window_S" OnClick="change_Selected('Armored_Window_S')">Armored Window S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Armored_Window_M" OnClick="change_Selected('Armored_Window_M')">Armored Window M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Armored_Window_L" OnClick="change_Selected('Armored_Window_L')">Armored Window L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bay_Window_XL" OnClick="change_Selected('Bay_Window_XL')">Bay Window XL</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Glass_Panel_S" OnClick="change_Selected('Glass_Panel_S')">Glass Panel S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Glass_Panel_M" OnClick="change_Selected('Glass_Panel_M')">Glass Panel M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Glass_Panel_L" OnClick="change_Selected('Glass_Panel_L')">Glass Panel L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Decorative_Cables_Hide" OnClick="hide_Content(1, 'Decorative_Cables_Hide', 'Decorative_Cables_Content_Hide', 'Decorative Cables:')">
								Decorative Cables:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Decorative_Cables_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Cable_Model_A_M" OnClick="change_Selected('Cable_Model_A_M')">Cable Model A M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Cable_Model_B_M" OnClick="change_Selected('Cable_Model_B_M')">Cable Model B M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Cable_Model_C_M" OnClick="change_Selected('Cable_Model_C_M')">Cable Model C M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Cable_Model_A_S" OnClick="change_Selected('Cable_Model_A_S')">Cable Model A S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Cable_Model_B_S" OnClick="change_Selected('Cable_Model_B_S')">Cable Model B S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Cable_Model_C_S" OnClick="change_Selected('Cable_Model_C_S')">Cable Model C S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Corner_Cable_Model_A" OnClick="change_Selected('Corner_Cable_Model_A')">Corner Cable Model A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Corner_Cable_Model_B" OnClick="change_Selected('Corner_Cable_Model_B')">Corner Cable Model B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Corner_Cable_Model_C" OnClick="change_Selected('Corner_Cable_Model_C')">Corner Cable Model C</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Antennas_Hide" OnClick="hide_Content(1, 'Antennas_Hide', 'Antennas_Content_Hide', 'Antennas:')">
								Antennas:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Antennas_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Antenna_S" OnClick="change_Selected('Antenna_S')">Antenna S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Antenna_M" OnClick="change_Selected('Antenna_M')">Antenna M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Antenna_L" OnClick="change_Selected('Antenna_L')">Antenna L</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Plants_Hide" OnClick="hide_Content(1, 'Plants_Hide', 'Plants_Content_Hide', 'Plants:')">
								Plants:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Plants_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Plant" OnClick="change_Selected('Plant')">Plant</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_A" OnClick="change_Selected('Plant_Case_A')">Plant Case A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_B" OnClick="change_Selected('Plant_Case_B')">Plant Case B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_C" OnClick="change_Selected('Plant_Case_C')">Plant Case C</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_D" OnClick="change_Selected('Plant_Case_D')">Plant Case D</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_E" OnClick="change_Selected('Plant_Case_E')">Plant Case E</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Suspended_Fruit_Plant" OnClick="change_Selected('Suspended_Fruit_Plant')">Suspended Fruit Plant</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Suspended_Plant_A" OnClick="change_Selected('Suspended_Plant_A')">Suspended Plant A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Suspended_Plant_B" OnClick="change_Selected('Suspended_Plant_B')">Suspended Plant B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bagged_Plant_A" OnClick="change_Selected('Bagged_Plant_A')">Bagged Plant A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bagged_Plant_B" OnClick="change_Selected('Bagged_Plant_B')">Bagged Plant B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bonsai" OnClick="change_Selected('Bonsai')">Bonsai</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Eggplant_Plant_Case" OnClick="change_Selected('Eggplant_Plant_Case')">Eggplant Plant Case</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Salad_Plant_Case" OnClick="change_Selected('Salad_Plant_Case')">Salad Plant Case</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_M" OnClick="change_Selected('Plant_Case_M')">Plant Case M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Squash_Plant_Case" OnClick="change_Selected('Squash_Plant_Case')">Squash Plant Case</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Plant_Case_S" OnClick="change_Selected('Plant_Case_S')">Plant Case S</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Ficus_Plant_A" OnClick="change_Selected('Ficus_Plant_A')">Ficus Plant A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Ficus_Plant_B" OnClick="change_Selected('Ficus_Plant_B')">Ficus Plant B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Foliage_Plant_Case_A" OnClick="change_Selected('Foliage_Plant_Case_A')">Foliage Plant Case A</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Foliage_Plant_Case_B" OnClick="change_Selected('Foliage_Plant_Case_B')">Foliage Plant Case B</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Furnitures_Hide" OnClick="hide_Content(1, 'Furnitures_Hide', 'Furnitures_Content_Hide', 'Furnitures:')">
								Furnitures:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Furnitures_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Dresser" OnClick="change_Selected('Dresser')">Dresser</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bench" OnClick="change_Selected('Bench')">Bench</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Low_Table" OnClick="change_Selected('Wooden_Low_Table')">Wooden Low Table</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Sofa" OnClick="change_Selected('Sofa')">Sofa</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Wardrobe" OnClick="change_Selected('Wooden_Wardrobe')">Wooden Wardrobe</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Table" OnClick="change_Selected('Table')">Table</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Trash" OnClick="change_Selected('Trash')">Trash</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Sofa" OnClick="change_Selected('Wooden_Sofa')">Wooden Sofa</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Nightstand" OnClick="change_Selected('Nightstand')">Nightstand</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wardrobe" OnClick="change_Selected('Wardrobe')">Wardrobe</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Chair" OnClick="change_Selected('Wooden_Chair')">Wooden Chair</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="HMS_Ajax33_Artist_Unknown" OnClick="change_Selected('HMS_Ajax33_Artist_Unknown')">HMS Ajax33 Artist Unknown</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Parrotos_Sanctuary_Artist_Unknown" OnClick="change_Selected('Parrotos_Sanctuary_Artist_Unknown')">Parrotos Sanctuary Artist Unknown</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Eye_Dolls_Workshop_Artist_Unkown" OnClick="change_Selected('Eye_Dolls_Workshop_Artist_Unkown')">Eye Dolls Workshop Artist Unkown</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Armchair" OnClick="change_Selected('Wooden_Armchair')">Wooden Armchair</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Round_Carpet" OnClick="change_Selected('Round_Carpet')">Round Carpet</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Square_Carpet" OnClick="change_Selected('Square_Carpet')">Square Carpet</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Dresser" OnClick="change_Selected('Wooden_Dresser')">Wooden Dresser</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Table_M" OnClick="change_Selected('Wooden_Table_M')">Wooden Table M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Wooden_Table_L" OnClick="change_Selected('Wooden_Table_L')">Wooden Table L</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Shelf_Empty" OnClick="change_Selected('Shelf_Empty')">Shelf Empty</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Shelf_Half_Full" OnClick="change_Selected('Shelf_Half_Full')">Shelf Half Full</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Shelf_Full" OnClick="change_Selected('Shelf_Full')">Shelf Full</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Bed" OnClick="change_Selected('Bed')">Bed</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Pipes_Hide" OnClick="hide_Content(1, 'Pipes_Hide', 'Pipes_Content_Hide', 'Pipes:')">
								Pipes:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Pipes_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Pipe_D_M" OnClick="change_Selected('Pipe_D_M')">Pipe D M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Pipe_Corner_M" OnClick="change_Selected('Pipe_Corner_M')">Pipe Corner M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Pipe_B_M" OnClick="change_Selected('Pipe_B_M')">Pipe B M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Pipe_A_M" OnClick="change_Selected('Pipe_A_M')">Pipe A M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Pipe_Connector_M" OnClick="change_Selected('Pipe_Connector_M')">Pipe Connector M</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Pipe_C_M" OnClick="change_Selected('Pipe_C_M')">Pipe C M</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Bathroom_Elements_Hide" OnClick="hide_Content(1, 'Bathroom_Elements_Hide', 'Bathroom_Elements_Content_Hide', 'Bathroom Elements:')">
								Bathroom Elements:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Bathroom_Elements_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Sink_Unit" OnClick="change_Selected('Sink_Unit')">Sink Unit</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Shower_Unit" OnClick="change_Selected('Shower_Unit')">Shower Unit</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Urinal_Unit" OnClick="change_Selected('Urinal_Unit')">Urinal Unit</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Toilet_Unit_B" OnClick="change_Selected('Toilet_Unit_B')">Toilet Unit B</TD>
								</TR>
								<TR>
									<TD CLASS="b" ID="Toilet_Unit_A" OnClick="change_Selected('Toilet_Unit_A')">Toilet Unit A</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Control_Units_Hide" OnClick="hide_Content(1, 'Control_Units_Hide', 'Control_Units_Content_Hide', 'Control Units:')">
							Control Units:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Control_Units_Content_Hide">
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Piloting_Control_Units_Hide" OnClick="hide_Content(1, 'Piloting_Control_Units_Hide', 'Piloting_Control_Units_Content_Hide', 'Piloting Control Units:')">
								Piloting Control Units:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Piloting_Control_Units_Content_Hide">
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Commandment_Seats_Hide" OnClick="hide_Content(1, 'Commandment_Seats_Hide', 'Commandment_Seats_Content_Hide', 'Commandment Seats:')">
									Commandment Seats:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Commandment_Seats_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Command_Seat_Controller" OnClick="change_Selected('Command_Seat_Controller')">Command Seat Controller</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Hovercraft_Cockpits_Hide" OnClick="hide_Content(1, 'Hovercraft_Cockpits_Hide', 'Hovercraft_Cockpits_Content_Hide', 'Hovercraft Cockpits:')">
									Hovercraft Cockpits:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Hovercraft_Cockpits_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Hovercraft_Seat_Controller" OnClick="change_Selected('Hovercraft_Seat_Controller')">Hovercraft Seat Controller</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Remote_Controllers_Hide" OnClick="hide_Content(1, 'Remote_Controllers_Hide', 'Remote_Controllers_Content_Hide', 'Remote Controllers:')">
									Remote Controllers:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Remote_Controllers_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Remote_Controller" OnClick="change_Selected('Remote_Controller')">Remote Controller</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
								<TABLE WIDTH=100%>
								<TR><TD CLASS="b">
								<P ID="Closed_Cockpits_Hide" OnClick="hide_Content(1, 'Closed_Cockpits_Hide', 'Closed_Cockpits_Content_Hide', 'Closed Cockpits:')">
									Closed Cockpits:
									<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
										<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
										<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
									</SVG>
								</P>
								<DIV ID="Closed_Cockpits_Content_Hide">
									<TABLE WIDTH=100%>
									<TR>
										<TD CLASS="b" ID="Cockpit_Controller" OnClick="change_Selected('Cockpit_Controller')">Cockpit Controller</TD>
									</TR>
									</TABLE>
								</DIV>
								</TD></TR></TABLE>
							</DIV>
							</TD></TR></TABLE>
							<TABLE WIDTH=100%>
							<TR><TD CLASS="b">
							<P ID="Generic_Control_Units_Hide" OnClick="hide_Content(1, 'Generic_Control_Units_Hide', 'Generic_Control_Units_Content_Hide', 'Generic Control Units:')">
								Generic Control Units:
								<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
									<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
									<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
								</SVG>
							</P>
							<DIV ID="Generic_Control_Units_Content_Hide">
								<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" ID="Programming_Board" OnClick="change_Selected('Programming_Board')">Programming Board</TD>
								</TR>
								</TABLE>
							</DIV>
							</TD></TR></TABLE>
						</DIV>
						</TD></TR></TABLE>
					</DIV>
					</TD></TR></TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Materials_Hide" OnClick="hide_Content(1, 'Materials_Hide', 'Materials_Content_Hide', 'Materials:')">
					Materials:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Materials_Content_Hide">
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Pures_Hide" OnClick="hide_Content(1, 'Pures_Hide', 'Pures_Content_Hide', 'Pures:')">
						Pures:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Pures_Content_Hide">
						<TABLE WIDTH=100%>
						<TR>
							<TD CLASS="b" ID="Carbon_Pure" OnClick="change_Selected('Carbon_Pure')">Carbon Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Iron_Pure" OnClick="change_Selected('Iron_Pure')">Iron Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Titanium_Pure" OnClick="change_Selected('Titanium_Pure')">Titanium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Tungsten_Pure" OnClick="change_Selected('Tungsten_Pure')">Tungsten Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Niobium_Pure" OnClick="change_Selected('Niobium_Pure')">Niobium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Rhenium_Pure" OnClick="change_Selected('Rhenium_Pure')">Rhenium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Copper_Pure" OnClick="change_Selected('Copper_Pure')">Copper Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Molybdenum_Pure" OnClick="change_Selected('Molybdenum_Pure')">Molybdenum Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Vanadium_Pure" OnClick="change_Selected('Vanadium_Pure')">Vanadium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Chromium_Pure" OnClick="change_Selected('Chromium_Pure')">Chromium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Aluminium_Pure" OnClick="change_Selected('Aluminium_Pure')">Aluminium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Manganese_Pure" OnClick="change_Selected('Manganese_Pure')">Manganese Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Silicon_Pure" OnClick="change_Selected('Silicon_Pure')">Silicon Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Nickel_Pure" OnClick="change_Selected('Nickel_Pure')">Nickel Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Scandium_Pure" OnClick="change_Selected('Scandium_Pure')">Scandium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Zirconium_Pure" OnClick="change_Selected('Zirconium_Pure')">Zirconium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Lead_Pure" OnClick="change_Selected('Lead_Pure')">Lead Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Sodium_Pure" OnClick="change_Selected('Sodium_Pure')">Sodium Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Gold_Pure" OnClick="change_Selected('Gold_Pure')">Gold Pure</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Platinum_Pure" OnClick="change_Selected('Platinum_Pure')">Platinum Pure</TD>
						</TR>
						</TABLE>
					</DIV>
					</TD></TR></TABLE>
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Fuels_Hide" OnClick="hide_Content(1, 'Fuels_Hide', 'Fuels_Content_Hide', 'Fuels:')">
						Fuels:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Fuels_Content_Hide">
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Rocket_Fuels_Hide" OnClick="hide_Content(1, 'Rocket_Fuels_Hide', 'Rocket_Fuels_Content_Hide', 'Rocket Fuels:')">
							Rocket Fuels:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Rocket_Fuels_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Xeron_Fuel" OnClick="change_Selected('Xeron_Fuel')">Xeron Fuel</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Atmospheric_Fuels_Hide" OnClick="hide_Content(1, 'Atmospheric_Fuels_Hide', 'Atmospheric_Fuels_Content_Hide', 'Atmospheric Fuels:')">
							Atmospheric Fuels:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Atmospheric_Fuels_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Nitron_Fuel" OnClick="change_Selected('Nitron_Fuel')">Nitron Fuel</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
						<TABLE WIDTH=100%>
						<TR><TD CLASS="b">
						<P ID="Space_Fuels_Hide" OnClick="hide_Content(1, 'Space_Fuels_Hide', 'Space_Fuels_Content_Hide', 'Space Fuels:')">
							Space Fuels:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
						<DIV ID="Space_Fuels_Content_Hide">
							<TABLE WIDTH=100%>
							<TR>
								<TD CLASS="b" ID="Kergon_Fuel" OnClick="change_Selected('Kergon_Fuel')">Kergon Fuel</TD>
							</TR>
							</TABLE>
						</DIV>
						</TD></TR></TABLE>
					</DIV>
					</TD></TR></TABLE>
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Products_Hide" OnClick="hide_Content(1, 'Products_Hide', 'Products_Content_Hide', 'Products:')">
						Products:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Products_Content_Hide">
						<TABLE WIDTH=100%>
						<TR>
							<TD CLASS="b" ID="Duralumin_Product" OnClick="change_Selected('Duralumin_Product')">Duralumin Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Marble_Product" OnClick="change_Selected('Marble_Product')">Marble Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Concrete_Product" OnClick="change_Selected('Concrete_Product')">Concrete Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Wood_Product" OnClick="change_Selected('Wood_Product')">Wood Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Titanium_21_Product" OnClick="change_Selected('Titanium_21_Product')">Titanium 21 Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Polycarbonate_Plastic_Product" OnClick="change_Selected('Polycarbonate_Plastic_Product')">Polycarbonate Plastic Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Carbon_Fiber_Product" OnClick="change_Selected('Carbon_Fiber_Product')">Carbon Fiber Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Zircaloy_Product" OnClick="change_Selected('Zircaloy_Product')">Zircaloy Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Brick_Product" OnClick="change_Selected('Brick_Product')">Brick Product</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Maraging_Steel_Product" OnClick="change_Selected('Maraging_Steel_Product')">Maraging Steel Product</TD>
						</TR>
						</TABLE>
					</DIV>
					</TD></TR></TABLE>
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Catalysts_Hide" OnClick="hide_Content(1, 'Catalysts_Hide', 'Catalysts_Content_Hide', 'Catalysts:')">
						Catalysts:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Catalysts_Content_Hide">
						<TABLE WIDTH=100%>
						<TR>
							<TD CLASS="b" ID="Catalyst_3" OnClick="change_Selected('Catalyst_3')">Catalyst 3</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Catalyst_4" OnClick="change_Selected('Catalyst_4')">Catalyst 4</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Catalyst_5" OnClick="change_Selected('Catalyst_5')">Catalyst 5</TD>
						</TR>
						</TABLE>
					</DIV>
					</TD></TR></TABLE>
					<TABLE WIDTH=100%>
					<TR><TD CLASS="b">
					<P ID="Honeycomb_Materials_Hide" OnClick="hide_Content(1, 'Honeycomb_Materials_Hide', 'Honeycomb_Materials_Content_Hide', 'Honeycomb Materials:')">
						Honeycomb Materials:
						<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
							<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
							<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
						</SVG>
					</P>
					<DIV ID="Honeycomb_Materials_Content_Hide">
						<TABLE WIDTH=100%>
						<TR>
							<TD CLASS="b" ID="Iron_Homeycomb_Material" OnClick="change_Selected('Iron_Homeycomb_Material')">Iron Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Plastic_Homeycomb_Material" OnClick="change_Selected('Plastic_Homeycomb_Material')">Plastic Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Copper_Homeycomb_Material" OnClick="change_Selected('Copper_Homeycomb_Material')">Copper Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Gold_Homeycomb_Material" OnClick="change_Selected('Gold_Homeycomb_Material')">Gold Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Wood_Homeycomb_Material" OnClick="change_Selected('Wood_Homeycomb_Material')">Wood Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Titanium_Homeycomb_Material" OnClick="change_Selected('Titanium_Homeycomb_Material')">Titanium Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Brick_Homeycomb_Material" OnClick="change_Selected('Brick_Homeycomb_Material')">Brick Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Steel_Homeycomb_Material" OnClick="change_Selected('Steel_Homeycomb_Material')">Steel Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Concrete_Homeycomb_Material" OnClick="change_Selected('Concrete_Homeycomb_Material')">Concrete Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Marble_Homeycomb_Material" OnClick="change_Selected('Marble_Homeycomb_Material')">Marble Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Chromium_Homeycomb_Material" OnClick="change_Selected('Chromium_Homeycomb_Material')">Chromium Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Aluminium_Homeycomb_Material" OnClick="change_Selected('Aluminium_Homeycomb_Material')">Aluminium Homeycomb Material</TD>
						</TR>
						<TR>
							<TD CLASS="b" ID="Carbonfiber_Homeycomb_Material" OnClick="change_Selected('Carbonfiber_Homeycomb_Material')">Carbonfiber Homeycomb Material</TD>
						</TR>
						</TABLE>
					</DIV>
					</TD></TR></TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE WIDTH=100%>
				<TR><TD CLASS="b">
				<P ID="Scraps_Hide" OnClick="hide_Content(1, 'Scraps_Hide', 'Scraps_Content_Hide', 'Scraps:')">
					Scraps:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Scraps_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Scandium_Scrap" OnClick="change_Selected('Scandium_Scrap')">Scandium Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Chromium_Scrap" OnClick="change_Selected('Chromium_Scrap')">Chromium Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Nickel_Scrap" OnClick="change_Selected('Nickel_Scrap')">Nickel Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Gold_Scrap" OnClick="change_Selected('Gold_Scrap')">Gold Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Platinum_Scrap" OnClick="change_Selected('Platinum_Scrap')">Platinum Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Manganese_Scrap" OnClick="change_Selected('Manganese_Scrap')">Manganese Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Tungsten_Scrap" OnClick="change_Selected('Tungsten_Scrap')">Tungsten Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Lead_Scrap" OnClick="change_Selected('Lead_Scrap')">Lead Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Sodium_Scrap" OnClick="change_Selected('Sodium_Scrap')">Sodium Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Aluminium_Scrap" OnClick="change_Selected('Aluminium_Scrap')">Aluminium Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Iron_Scrap" OnClick="change_Selected('Iron_Scrap')">Iron Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Copper_Scrap" OnClick="change_Selected('Copper_Scrap')">Copper Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Molybdenum_Scrap" OnClick="change_Selected('Molybdenum_Scrap')">Molybdenum Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Carbon_Scrap" OnClick="change_Selected('Carbon_Scrap')">Carbon Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Zirconium_Scrap" OnClick="change_Selected('Zirconium_Scrap')">Zirconium Scrap</TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Silicon_Scrap" OnClick="change_Selected('Silicon_Scrap')">Silicon Scrap</TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
			</DIV>
			</TD></TR>
			<TR><TD CLASS="b">
			<P ID="BP_Hide" OnClick="hide_Content(1, 'BP_Hide', 'BP_Content_Hide', 'Blueprints:')">
				Blueprints:
				<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
					<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
				</SVG>
			</P>
			<DIV ID="BP_Content_Hide">
				<TABLE WIDTH=100%>
					<TR><TD CLASS="b" OnClick="show_BP_Menu()">Create Blueprint Mode!
					</TD></TR>
				</TABLE>
				<DIV ID="BP_List">
				</DIV>
			</DIV>
			</TD></TR></TABLE>
			</FORM>
		</DIV>
		<DIV CLASS="options_Area">
			<FORM NAME="Options_Form" METHOD=POST>
			<TABLE WIDTH=100%>
			<TR><TD CLASS="b">
			<SPAN ID="options_Hide" OnClick="options_Hide()">
				<SVG WIDTH="12" HEIGHT="12">
					<line x1="2" y1="2" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="10" y1="2" x2="2" y2="10" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="1" y1="6" x2="11" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
					<line x1="6" y1="1" x2="6" y2="11" style="stroke:rgb(255,255,255);stroke-width:2" />
					<circle cx="6" cy="6" r="3" style="stroke:rgb(255,255,255)" />
				</SVG>
			</SPAN><SPAN style="float: right; cursor: pointer;"><A href="?action=logout">Log Out</A> - <A OnClick="history.go(-1);">Back</A></SPAN>
			<DIV ID="options_Content_Hide">
				<TABLE WIDTH=100%>
				<TR>
					<TD CLASS="b" OnClick="add_Everything_To_Inv()">Add stuff to inv! (1k of all items)</TD>
				</TR>
				<TR>
					<TD CLASS="b">Shift Que location instead of swap<INPUT TYPE="checkbox" ID="shift_Que_Instead_Of_Swap_Checkbox" CLASS="craftable_Box" OnClick="shift_Que_Instead_Of_Swap_Check()" checked /></TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="text_Data_Import('inv')">Import to inventory from string</TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="text_Data_Import('que')">Import to que from string</TD>
				</TR>
				<TR>
					<TD><INPUT TYPE="text" ID="text_Import_Export" VALUE="" SIZE=10 /><SPAN CLASS="craftable_Box">Overwrite:<INPUT TYPE="checkbox" ID="text_Import_Export_Checkbox" OnClick="text_Import_Export_Check()" /></SPAN></TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="text_Data_Export('inv')">Export from inventory to string</TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="text_Data_Export('que')">Export from que to string</TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="delete_BP()">Reset BP</TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="delete_Que()">Reset Que</TD>
				</TR>
				<TR>
					<TD CLASS="b" OnClick="delete_Inventory()">Reset Inventory</TD>
				</TR>
				<TR>
					<TD CLASS="b">
						<DIV ID="color_Change_Content_Hide">
							<TABLE WIDTH=100%>
								<TR>
									<TD CLASS="b" OnClick="default_Colors()">Restore default colors</TD>
								</TR>
								<TR>
									<TD CLASS="b" OnClick="text_Color_Change()">(Change text color)</TD>
								</TR>
								<TR>
									<TD CLASS="b" OnClick="background_Color_Change()">(Change background color)</TD>
								</TR>
								<TR>
									<TD CLASS="b">R:<INPUT TYPE="text" ID="colorR" VALUE="255" SIZE=1 />G:<INPUT TYPE="text" ID="colorG" VALUE="255" SIZE=1 />B:<INPUT TYPE="text" ID="colorB" VALUE="255" SIZE=1 /></TD>
								</TR>
							</TABLE>
						</DIV>
						<P ID="color_Change_Hide" OnClick="color_Change_Content()">
							Color change:
							<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
								<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
								<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
							</SVG>
						</P>
					</TD>
				</TR>
				</TABLE>
			</DIV>
			</TD></TR></TABLE>
			</FORM>
		</DIV>
	</DIV>

	<DIV CLASS="right_Area">
		<DIV CLASS="right_Area_Top">
			<DIV CLASS="right_Area_Left">
				<DIV ID="inventory_list">
				</DIV>
			</DIV>
			<DIV CLASS="right_Area_Center">
				<DIV ID="part_Selected"><TABLE WIDTH=100%><TR><TD COLSPAN=2><TABLE WIDTH=100%><TR><TD OnClick='change_Selected_Back()'><SPAN CLASS='go_Left'><H3>⇐</H3></SPAN></TD><TD><CENTER><H3>Nothing selected!</H3></CENTER></TD><TD OnClick='change_Selected_Forward()'><SPAN CLASS='go_Right'><H3>⇒</H3></SPAN></TD></TR></TABLE></TD></TR><TR><TD>Material</TD><TD>#</TD></TR></TABLE>
				</DIV>
			</DIV>
			<DIV CLASS="right_Area_Right">
				<DIV ID="part_Selected_Volume">
					Volume:
				</DIV>
				<BR>
				<DIV ID="part_Selected_Time">
					Time:
				</DIV>
				<BR>
				<DIV ID="part_Selected_Tier">
					Tier:
				</DIV>
				<BR>
				<FORM NAME="Inv_Que_Adder" METHOD=POST>
				<INPUT CLASS="button_Inputs" TYPE="Number" ID="amount_To_Add_User_Input" VALUE="1" /><INPUT CLASS="button_Inputs" TYPE="button" VALUE="Set inventory size" OnClick="change_Inventory_Size()" />
				<BR>
				<INPUT CLASS="button_Inputs" TYPE="button" VALUE="Add to queue" OnClick="update_Que()" /><INPUT CLASS="button_Inputs" TYPE="button" VALUE="Add to inventory" OnClick="update_Inventory()" />
				<BR><BR>
				<DIV ID="inventory_Size_Text">
					<P>
						Inventory size: 4000 L
					</P>
				</DIV>
				<BR>
				<DIV ID="inventory_Used_Text">
					<P>
						Inventory used: 0 L
					</P>
				</DIV>
				<BR>
				<P>
					Add prerequisites to que:
					<INPUT TYPE="checkbox" ID="prerequisites_Checkbox" CLASS="craftable_Box" OnClick="prerequisites_Check()" checked />
				</P>
				<SPAN ID="prerequisites_Checkbox_Hide">
				<P>
					Add prerequisites to que (Rounded):
					<INPUT TYPE="checkbox" ID="prerequisites_Rounded_Checkbox" CLASS="craftable_Box" OnClick="prerequisites_Rounded_Check()" checked />
				</P>
				<P>
					Craft from inventory:
					<INPUT TYPE="checkbox" ID="inventory_Only_Checkbox" CLASS="craftable_Box" OnClick="inventory_Only_Check()" />
				</P>
				<BR>
				<P>
					DO NOT ADD PURES to que:
					<INPUT TYPE="checkbox" ID="do_Not_Add_Pures_Checkbox" CLASS="craftable_Box" OnClick="do_Not_Add_Pures_Check()" checked />
				</P>
				</SPAN>
				<SPAN ID="prerequisites_Checkbox_BR_Hide">
				<BR><BR><BR><BR>
				</SPAN>
				<BR>
				<DIV ID="error_Place">
					<P>
						Error: none
					</P>
				</DIV>
				<BR><BR>
				</FORM>
			</DIV>
		</DIV>
		<DIV CLASS="right_Area_Bottom">
			<DIV ID="que_List">
			</DIV>
			<DIV ID="BP_Menu">
				<TABLE>
					<TR>
						<TD>Name:<INPUT TYPE=TEXT ID="BP_Name" VALUE="" SIZE=10 /><CENTER>Create Blueprint Mode!</CENTER></TD>
					</TR>
					<TR>
						<TD><INPUT TYPE=BUTTON NAME="BP_Add" OnClick="add_Item_To_BP_Field()" VALUE="Add Selected" SIZE=10 /><INPUT TYPE=TEXT ID="BP_Add_Num" VALUE="1" SIZE=10 /><INPUT TYPE=BUTTON NAME="BP_Submitter" OnClick="update_BP()" VALUE="Submit BP" SIZE=10 /><CENTER><INPUT TYPE=BUTTON NAME="return_To_Que_Button" OnClick="show_BP_Menu()" VALUE="Return to que table" SIZE=10 /></CENTER></TD>
					</TR>
					<TR>
						<TD><TEXTAREA ID="BP_Materials" ROWS="20" COLS="150"></TEXTAREA></TD>
					</TR>
				</TABLE>
				<BR><BR><BR><BR><BR><BR><BR><BR><BR><BR>
				<P>
					Check to calculate to ores instead of pures:
					<INPUT TYPE="checkbox" ID="use_Ores_Checkbox" OnClick="use_Ores_Check()" />
				</P>
				<BR>
				<INPUT TYPE=BUTTON OnClick="set_Local_Price_Values_Storage()" Value="Click to save values to local storage" />
				<TABLE>
				<TR><TD CLASS="b">
				<P ID="Tier_1_Hide" OnClick="hide_Content(1, 'Tier_1_Hide', 'Tier_1_Content_Hide', 'Tier 1:')">
					Tier 1:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Tier_1_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Sodium_Price" OnClick="change_Selected('Sodium_Pure')">Sodium</TD>
						<TD><INPUT TYPE=TEXT ID="Sodium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Carbon_Price" OnClick="change_Selected('Carbon_Pure')">Carbon</TD>
						<TD><INPUT TYPE=TEXT ID="Carbon_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Silicon_Price" OnClick="change_Selected('Silicon_Pure')">Silicon</TD>
						<TD><INPUT TYPE=TEXT ID="Silicon_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Iron_Price" OnClick="change_Selected('Iron_Pure')">Iron</TD>
						<TD><INPUT TYPE=TEXT ID="Iron_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					</TABLE>
				</DIV>
				</TD>
				<TD CLASS="b">
				<P ID="Tier_2_Hide" OnClick="hide_Content(1, 'Tier_2_Hide', 'Tier_2_Content_Hide', 'Tier 2:')">
					Tier 2:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Tier_2_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Aluminium_Price" OnClick="change_Selected('Aluminium_Pure')">Aluminium</TD>
						<TD><INPUT TYPE=TEXT ID="Aluminium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Nickel_Price" OnClick="change_Selected('Nickel_Pure')">Nickel</TD>
						<TD><INPUT TYPE=TEXT ID="Nickel_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Lead_Price" OnClick="change_Selected('Lead_Pure')">Lead</TD>
						<TD><INPUT TYPE=TEXT ID="Lead_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Tungsten_Price" OnClick="change_Selected('Tungsten_Pure')">Tungsten</TD>
						<TD><INPUT TYPE=TEXT ID="Tungsten_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					</TABLE>
				</DIV>
				</TD>
				<TD CLASS="b">
				<P ID="Tier_3_Hide" OnClick="hide_Content(1, 'Tier_3_Hide', 'Tier_3_Content_Hide', 'Tier 3:')">
					Tier 3:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Tier_3_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Scandium_Price" OnClick="change_Selected('Scandium_Pure')">Scandium</TD>
						<TD><INPUT TYPE=TEXT ID="Scandium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Chromium_Price" OnClick="change_Selected('Chromium_Pure')">Chromium</TD>
						<TD><INPUT TYPE=TEXT ID="Chromium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Copper_Price" OnClick="change_Selected('Copper_Pure')">Copper</TD>
						<TD><INPUT TYPE=TEXT ID="Copper_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Platinum_Price" OnClick="change_Selected('Platinum_Pure')">Platinum</TD>
						<TD><INPUT TYPE=TEXT ID="Platinum_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR></TABLE>
				<TABLE>
				<TR><TD CLASS="b">
				<P ID="Tier_4_Hide" OnClick="hide_Content(1, 'Tier_4_Hide', 'Tier_4_Content_Hide', 'Tier 4:')">
					Tier 4:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Tier_4_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Zirconium_Price" OnClick="change_Selected('Zirconium_Pure')">Zirconium</TD>
						<TD><INPUT TYPE=TEXT ID="Zirconium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Manganese_Price" OnClick="change_Selected('Manganese_Pure')">Manganese</TD>
						<TD><INPUT TYPE=TEXT ID="Manganese_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Molybdenum_Price" OnClick="change_Selected('Molybdenum_Pure')">Molybdenum</TD>
						<TD><INPUT TYPE=TEXT ID="Molybdenum_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Gold_Price" OnClick="change_Selected('Gold_Pure')">Gold</TD>
						<TD><INPUT TYPE=TEXT ID="Gold_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					</TABLE>
				</DIV>
				</TD>
				<TD CLASS="b">
				<P ID="Tier_5_Hide" OnClick="hide_Content(1, 'Tier_5_Hide', 'Tier_5_Content_Hide', 'Tier 5:')">
					Tier 5:
					<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right">
						<line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb(255,255,255);stroke-width:2" />
						<line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb(255,255,255);stroke-width:2" />
					</SVG>
				</P>
				<DIV ID="Tier_5_Content_Hide">
					<TABLE WIDTH=100%>
					<TR>
						<TD CLASS="b" ID="Vanadium_Price" OnClick="change_Selected('Vanadium_Pure')">Vanadium</TD>
						<TD><INPUT TYPE=TEXT ID="Vanadium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Titanium_Price" OnClick="change_Selected('Titanium_Pure')">Titanium</TD>
						<TD><INPUT TYPE=TEXT ID="Titanium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Niobium_Price" OnClick="change_Selected('Niobium_Pure')">Niobium</TD>
						<TD><INPUT TYPE=TEXT ID="Niobium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					<TR>
						<TD CLASS="b" ID="Rhenium_Price" OnClick="change_Selected('Rhenium_Pure')">Rhenium</TD>
						<TD><INPUT TYPE=TEXT ID="Rhenium_Price_Input" VALUE="0" SIZE=15 /></TD>
					</TR>
					</TABLE>
				</DIV>
				</TD></TR>
				<TR>
					<TD>% markup on pures:</TD>
					<TD><INPUT TYPE=TEXT ID="markup_Price_Input" VALUE="0" SIZE=15 /></TD>
				</TR>
				<TR>
					<TD>Price per second of crafting time:</TD>
					<TD><INPUT TYPE=TEXT ID="time_Price_Input" VALUE="0" SIZE=15 /></TD>
				</TR></TABLE>
			</DIV>
		</DIV>
	</DIV>
</DIV>

<script type="text/javascript" src="../js/crafting.js"></script>
</BODY>
</HTML>
EOL;

            }
        }
    }

    if ($found == false) {
        echo '<h3>Unauthorized</h3>';
        echo '<p><a href="?action=logout">Log Out</a></p>';
    }
} else {
    echo '<h3>You must login before you can view this page, taking you back to the homepage now.</h3>';
    echo '<p>If this page does not automatically redirect you, <a href="http://dual.sh/index.php">click here.</a></p>';
    header('Refresh: 5; URL=http://dual.sh/index.php');
}

?>
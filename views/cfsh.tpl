% if section == 'head':

	<title>Cfsh</title>
	<link href="blog.css" rel="stylesheet"/>

% elif section == 'content':
  	<div id="title">
		<h2 id="cfsh-logo">#:</h2><h2>Cfsh</h2>
		<a href="https://www.npmjs.com/package/cfsh"><img src="npm.png" height="40px" alt="npm-link"/></a>
		<a id="github-link" href="https://github.com/svolpe43"><img src="github.png" alt="Github link" height="40px"/></a>
		<br><br><h4>Node.js, AWS</h4>
	</div>
    <div id="blog">
    	<p>
    	Cfsh is a shell that mimics the Bash terminal and allows you to traverse AWS components just like you would directories in a file system with "cd" and "ls". It is built using Node.js and the AWS API. There are over 30 built-in commands that allow you to traverse, interact and monitor AWS components. Using this tool should be natural to any developer that is familiar with a Linux terminal. This tool has mostly replaced the AWS console from my workflow.
    	</p>
    	<div id="examples">
    		<h4>'cd' and 'ls' to different AWS resources.</h4>
	    	<img src="cfsh/img/resource_stuff.gif" width="80%" alt="npm-link"/>
    		<h4>'ssh' into instances.</h4>
    		<img src="cfsh/img/misc_res_stuff.gif" width="80%" alt="npm-link"/>
	    	<h4>'rm' and 'mk' Cloudformation stacks.</h4>
	    	<img src="cfsh/img/stack_ops.gif" width="80%" alt="npm-link"/>
	    	<h4>Get info from AWS resources.</h4>
	    	<img src="cfsh/img/stack_stuff.gif" width="80%" alt="npm-link"/>
	    	<h4>Cfsh comes with over 30 commands</h4>
	    	<table class="table">
				<tr>
					<td><strong>mk, rm</strong></td>
					<td>Remove or delete stacks.</td>
				</tr>
				<tr>
					<td><strong>cat</strong></td>
					<td>Cat a file on an instance.</td>
				</tr>
				<tr>
					<td><strong>ls</strong></td>
					<td>List AWS resources.</td>
				</tr>
				<tr>
					<td><strong>stats</strong></td>
					<td>Inspect the CPU and memory usage of an instance.</td>
				</tr>
				<tr>
					<td><strong>vols</strong></td>
					<td>List all the volumes that are attached to the instances in an ASG.</td>
				</tr>
				<tr>
					<td><strong>ssh</strong></td>
					<td>Start ssh sessions to an instance.</td>
				</tr>
				<tr>
					<td><strong>sshall</strong></td>
					<td>Ssh into all the instances in the ASG.</td>
				</tr>
				<tr>
					<td><strong>sshrand</strong></td>
					<td>Ssh into a random instances in the ASG.</td>
				</tr>
			</table>
			<h4>And many more.</h4>
    	</div>
    </div>
% end

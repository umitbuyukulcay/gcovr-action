import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as action from "./action";

export async function check() {
  try {
    await io.which("gcovr", true);
  } catch {
    // gcovr is not available, installing
    await core.group("Install gcovr", async () => {
      await exec.exec("pip3 install gcovr");
    });
  }
}

function getArgs(inputs: action.Inputs): string[] {
  let args: string[] = [];
  if (inputs.root !== null) {
    args = args.concat(["--root", inputs.root]);
  }
  if (inputs.gcovExecutable !== null) {
    args = args.concat("--gcov-executable", inputs.gcovExecutable);
  }
  if (inputs.exclude !== null) {
    args = args.concat("--exclude", inputs.exclude);
  }
  if (inputs.failUnderLine !== null) {
    args = args.concat("--fail-under-line", inputs.failUnderLine.toString());
  }
  if (inputs.coverallsOut !== null) {
    args = args.concat("--coveralls", inputs.coverallsOut);
  }
  return args;
}

export async function run(inputs: action.Inputs) {
  const args = getArgs(inputs);
  core.startGroup("Generate code coverage report using gcovr");
  await exec.exec("gcovr", args);
  core.endGroup();
}

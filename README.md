# React Native 0.86 → 0.87 upgrade lab

A small store-audit app used to document a real upgrade from React Native
**0.86.3 to 0.87.1**: what broke, how it was fixed, and what Metro gained.

Write-up: [Upgrading to React Native 0.87](https://www.praveensingh.co.in/blog/react-native-0-87-upgrade)
by [Praveen Singh](https://www.praveensingh.co.in).

The app deliberately uses APIs that 0.87 changes (deep imports, `*Properties`
types, `NativeMethods`, ref types, `InteractionManager`, `StatusBar` and
`Modal` props, `ImageBackground`, `useColorScheme`), so the upgrade surfaces
the errors a real codebase would hit.

## Follow the upgrade commit by commit

| Commit | Step |
| --- | --- |
| `RN 0.86.3 baseline` | The app on 0.86.3; `tsc --noEmit` is clean |
| `Metro baseline on 0.86.3` | Measurement script and first results |
| `Upgrade to 0.87.1 (template diff + deps)` | Upgrade Helper diff applied, before any code fixes: 16 type errors |
| `Fix 0.87 breaking changes` | The code changes that get back to 0 errors |
| `Metro measurements` / large-app commits | Measurement rounds and the synthetic large app |

```bash
git log --oneline
git diff <upgrade commit> <fix commit> -- src   # just the code fixes
```

## Reproduce the measurements

```bash
npm install
npm run typecheck
./scripts/measure-metro.sh                      # this app
node scripts/generate-large-app.js 2000         # synthetic 2,000-screen app
ENTRY=index.large ./scripts/measure-metro.sh    # Metro on the large app
```

Results land in `metrics/`. To measure 0.86.3, check out its `package.json`
and `package-lock.json` from the baseline commit and reinstall. Runs that
overlapped with other heavy work on the machine are kept in
`metrics/discarded/` for transparency.

## Android build

`cd android && ./gradlew :app:assembleDebug` builds on 0.87.1 (AGP 9,
Gradle 9.4.1, SDK 37, which Gradle downloads by itself). The last commit
also drops the template's two AGP 9 opt-outs, which means removing the
separate Kotlin plugin from `android/app/build.gradle`. Build logs for each
step are in `metrics/android/`.

## Scope

The app wasn't run on a device or emulator, and the iOS app wasn't built
(0.87 has no iOS template changes). Swift Package Manager wasn't tried.

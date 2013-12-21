public class Kasai {
 
        // в sufArray (s.length() + 1) элементов Ч включа€ пустой суффикс
        public static int[] solve(String s, String[] sufArray) {
                int pos[] = new int[s.length() + 1];
                for (int i = 0; i <= s.length(); i++) {
                        pos[i] = s.length() - sufArray[i].length() + 1;
                }
                int rank[] = new int[s.length() + 1];
                for (int i = 0; i <= s.length(); i++) {
                        rank[pos[i]] = i;
                }
                int ans[] = new int[s.length() + 1];
                int h = 0;
                for (int i = 1; i <= s.length(); i++) {
                        if (rank[i] > 1) {
                                int k = pos[rank[i] - 1];
                                while (((i + h - 1) != s.length())
                                                && ((k + h - 1) != s.length())
                                                && (s.charAt(i + h - 1) == s.charAt(k + h - 1)))
                                        h++;
                                ans[rank[i]] = h;
                                if (h > 0)
                                        h--;
                        }
                }
                return ans; // ans[i + 1] = длина наибольшего общего префикса sufArray[i] и sufArray[i - 1]
        }
}

јлгоритм  асаи (јримуры Ч јрикавы Ч  асаи Ч Ћи Ч ѕарка) Ч алгоритм, за линейное врем€ наход€щий длины наибольших общих префиксов (англ. lcp, longest common prefix) у всех пар суффиксов данной строки, соседних в лексикографическом пор€дке (т.е. у всех соседних элементов суффиксного массива). ¬ходом алгоритма €вл€ютс€ сама строка и суффиксный массив, выходом Ч массив длин наибольших общих префиксов.

